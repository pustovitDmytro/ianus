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
        this.client = createClient({
            socket : {
                port : redisConf.port,
                host : redisConf.host
            },
            username : redisConf.username,
            password : redisConf.password,
            database : redisConf.database
        });
        this.ttl = ttl / MS_TO_SEC;
        this.connected = false;
        CACHES.push(this);
    }

    async connect() {
        if (this.connected) return;
        await this.client.connect();
        this.connected = true;
    }

    async close() {
        if (!this.connected) return;

        await this.client.quit();
        this.connected = false;
    }

    async saveAll(keys) {
        await this.connect();

        let chain = this.client.multi();

        for (const key of keys) {
            chain = chain.SETEX(`${this.prefix}${key}`, this.ttl, cachedValue);
        }

        const res = await chain.exec();

        await this.close();

        return res;
    }

    async areAllSaved(keys) {
        await this.connect();

        let chain = this.client.multi();

        for (const key of keys) {
            chain = chain.GET(`${this.prefix}${key}`);
        }

        const res = await chain.exec();

        await this.close();

        return res.every(r => r === cachedValue);
    }
}

shutdown.register(
    'Caches',
    () => Promise.all(CACHES.map(cache => cache.close()))
);
