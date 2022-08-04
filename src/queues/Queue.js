import Bull from 'bull';
import Redis from 'ioredis';
import packageConfig from '../../package';
import logger, { logDecorator }  from '../logger';
import { getJobRunner } from '../workers/utils';
import shutdown from '../shutdown';

export const QUEUES = [];

function dumpJob(job) {
    return job.toJSON();
}

export default class Queue {
    // https://docs.bullmq.io/bull/patterns/reusing-redis-connections
    static getClient(redis, type) {
        if (!this.clients) this.clients = {};

        if (this.clients[type]) return this.clients[type];
        const client = new Redis({
            port     : redis.port,
            host     : redis.host,
            db       : redis.db,
            password : redis.password,
            username : redis.username || null,

            maxRetriesPerRequest : null,
            enableReadyCheck     : false
        });

        if (type === 'bclient') {
            return client;
        }

        this.clients[type] = client;

        return client;
    }

    static createQuue({
        redis,
        name,
        rateLimit
    }) {
        return new Bull(name, {
            limiter : rateLimit && {
                max      : rateLimit.max,
                duration : rateLimit.duration
            },
            prefix : packageConfig.name,

            createClient(type) {
                return Queue.getClient(redis, type);
            }
        });
    }

    constructor(opts, jobs) {
        this.ttl = opts.ttl;
        this.attempts = opts.attempts;
        this.backoff = opts.backoff;
        this.concurrency = opts.concurrency;
        this.rateLimit = opts.rateLimit;
        this.name = opts.name;
        this.repeat = opts.repeat;
        this.logLevel = opts.logLevel;
        this.removeOnComplete = opts.autoremove === 0;
        if (opts.autoremove) this.keepLast = opts.autoremove;

        this.queue = Queue.createQuue({
            name      : this.name,
            redis     : opts.redis,
            rateLimit : opts.rateLimit
        });

        if (!opts.canProcess) {
            this.queue.pause(true);
        }

        this.jobTypes = Object.keys(jobs);

        this.jobTypes.forEach(type => {
            const decoratorConfig = {
                level : this.logLevel,
                name  : `queue.${this.name}.${type}`
            };

            this.queue.process(
                type,
                this.concurrency,
                getJobRunner(jobs[type], decoratorConfig)
            );
        });

        this.queue.on('error', logger.error);
        this.queue.on('failed', (job, error) => {
            logger.error({ job: dumpJob(job), error });
        });

        QUEUES.push(this);
    }


    @logDecorator({ level: 'verbose' })
    async createJob(type, data, options = {}) {
        if (!this.jobTypes.includes(type)) throw new Error(`WRONG_JOB_TYPE: ${type}`);
        const job = await this.queue.add(type, data, {
            timeout : this.ttl,
            backoff : this.backoff && {
                type  : this.backoff.type,
                delay : this.backoff.delay
            },
            attempts         : this.attempts,
            removeOnComplete : this.removeOnComplete,
            repeat           : this.repeat ? { cron: this.repeat } : null,
            ...options
        });

        return dumpJob(job);
    }

    async findCompletedJobs() {
        return this.queue.getJobs([ 'completed' ]);
    }

    async close() {
        const isConnected = this.queue.clients.some(c => c.status === 'ready');

        if (isConnected) {
            await this.queue.pause(true);
        }
    }

    async clean(force) {
        await this.queue.obliterate({ force });

        return { 'obliterated': true };
    }

    static async clean(force) {
        await Promise.all(QUEUES.map(queue => queue.clean(force)));
    }

    static async reset() {
        await Promise.all(QUEUES.map(Que => Que.queue.resume(true)));
    }
}

shutdown.register(
    'Queues',
    () => Promise.all(QUEUES.map(queue => queue.close()))
);
