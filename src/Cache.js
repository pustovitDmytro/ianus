// import ms from 'ms';
import { createClient } from 'redis';

const cachedValue = '1';
const MS_TO_SEC = 1000;

export default class Cache {
    constructor({
        prefix,
        redis:{ password, ...credentials },
        ttl
    }) {
        this.prefix = prefix;
        const redisConf = { ...credentials };

        if (password) redisConf.password = password; // Disables node_redis: Warning

        this.client = createClient({
            ...redisConf,
            prefix
        });
        this.ttl = ttl / MS_TO_SEC;
        this.client.connect();
    }

    async saveAll(keys) {
        let chain = this.client.multi();

        for (const key of keys) {
            chain = chain.SETEX(key, this.ttl, cachedValue);
        }

        return chain.exec();
    }

    async areAllSaved(keys) {
        let chain = this.client.multi();

        for (const key of keys) {
            chain = chain.GET(key);
        }

        const res = await chain.exec();

        return res.every(r => r === cachedValue);
    }
}
