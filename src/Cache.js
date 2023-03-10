import createClient from './redis';
import shutdown from './shutdown';

const cachedValue = '1';
const MS_TO_SEC = 1000;
const CACHES = [];

export default class Cache {
    constructor({
        prefix,
        ttl
    }) {
        this.prefix = prefix;
        this.createClient();
        this.ttl = ttl / MS_TO_SEC;
        CACHES.push(this);
    }

    createClient() {
        this.client = createClient();
    }

    async reset() {
        this._isClosing = false;
    }

    async close() {
        this._isClosing = true;
    }

    async saveAll(keys) {
        if (this._isClosing) return;
        let chain = this.client.pipeline();

        for (const key of keys) {
            chain = chain.setex(`${this.prefix}${key}`, this.ttl, cachedValue);
        }

        const res = await chain.exec();

        return res.map(r => r[1]);
    }

    async areAllSaved(keys) {
        let chain = this.client.pipeline();

        for (const key of keys) {
            chain = chain.get(`${this.prefix}${key}`);
        }

        const res = await chain.exec();

        return res.every(r => r[1] === cachedValue);
    }
}

export function reset() {
    return Promise.all(CACHES.map(cache => cache.reset()));
}

shutdown.register(
    'Caches',
    () => Promise.all(CACHES.map(cache => cache.close()))
);
