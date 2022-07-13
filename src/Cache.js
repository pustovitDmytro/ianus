import { createClient } from 'redis';

const cachedValue = '1';
const MS_TO_SEC = 1000;

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
    }

    async connect() {
        if (this.connected) return;
        await this.client.connect();
        this.connected = true;
    }

    // TODO: client.quit() on shutdown

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
