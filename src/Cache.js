import { createClient } from 'redis';
import shutdown from './shutdown';

const cachedValue = '1';
const MS_TO_SEC = 1000;
const CACHES = [];

export default class Cache {
    constructor({
        prefix,
        redis:redisConf,
        ttl
    }) {
        this.prefix = prefix;
        this._redisConf = redisConf;
        this.createClient();
        this.ttl = ttl / MS_TO_SEC;
        CACHES.push(this);
    }

    createClient() {
        const redisConf = this._redisConf;

        this.client = createClient({
            socket : {
                port : redisConf.port,
                host : redisConf.host
            },
            username : redisConf.username,
            password : redisConf.password,
            database : redisConf.database
        });
    }

    async reconnect() {
        this.close();
        this.createClient();
    }

    async connect() {
        try {
            await this.client.connect();
        } catch (error) {
            if (error.message !== 'Socket already opened') throw error;
        }
    }

    async close() {
        try {
            await this.client.quit();
        } catch (error) {
            if (![ 'The client is closed', 'This socket has been ended by the other party' ].includes(error.message)) throw error;
        }
    }

    async saveAll(keys) {
        await this.connect();

        let chain = this.client.multi();

        for (const key of keys) {
            chain = chain.SETEX(`${this.prefix}${key}`, this.ttl, cachedValue);
        }

        return chain.exec();
    }

    async areAllSaved(keys) {
        await this.connect();

        let chain = this.client.multi();

        for (const key of keys) {
            chain = chain.GET(`${this.prefix}${key}`);
        }

        const res = await chain.exec();

        return res.every(r => r === cachedValue);
    }
}

shutdown.register(
    'Caches',
    () => Promise.all(CACHES.map(cache => cache.close()))
);
