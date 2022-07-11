import Bull from 'bull';
import packageConfig from '../../package';
import logger, { logDecorator }  from '../logger';
import { getJobRunner } from '../workers/utils';

const QUEUES = [];

function dumpJob(job) {
    return job.toJSON();
}

export default class Queue {
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
            redis : {
                port     : redis.port,
                host     : redis.host,
                db       : redis.db,
                password : redis.password,
                username : redis.username || null
            },
            prefix : packageConfig.name
        });
    }

    constructor(opts, jobs = {}) {
        this.ttl = opts.ttl;
        this.attempts = opts.attempts;
        this.backoff = opts.backoff;
        this.concurrency = opts.concurrency;
        this.rateLimit = opts.rateLimit;
        this.name = opts.name;
        this.repeat = opts.repeat;
        this.logLevel = opts.logLevel;
        this.removeOnComplete = opts.removeOnComplete;

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

    async findPendingJobs() {
        return this.queue.getJobs([ 'waiting' ]);
    }

    async close() {
        const isConnected = this.queue.clients[0].status === 'ready';

        if (isConnected) {
            await this.queue.pause(true)
                .catch(error => logger.error({
                    code : 'QUEUE_CLOSE',
                    name : this.name,
                    error
                }));
        }
    }

    async clean(force) {
        if (force) {
            await this.queue.obliterate({ force });

            return { 'obliterated': true };
        }

        const states = [ 'active', 'paused' ];

        const res = { cleaned: [] };

        await Promise.all(states.map(async state => {
            const jobs = await this.queue.getJobs([ state ]);

            res[state] = jobs.length;
        }));
        const minute = 60_000;

        await Promise.all(states.map(async state => {
            await this.queue.clean(minute, state);
            res.cleaned.push(state);
        }));

        return res;
    }

    static async clean(force) {
        await Promise.all(QUEUES.map(queue => queue.clean(force)));
    }
}

export async function onShutdown() {
    await Promise.all(QUEUES.map(queue => queue.close()));
}
