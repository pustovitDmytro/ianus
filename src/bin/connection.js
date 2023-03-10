#!./node_modules/.bin/babel-node
import { docopt } from 'docopt';
import getClient from '../redis';

import { docoptRunner } from './utils';

const doc = `Usage:
    test.js redis
    test.js -h | --help

    Options:
        -h  --help    Test connection
`;

async function testRedis() {
    const client = getClient({
        connectTimeout : 10_000
    });

    console.log('connecting...');
    const key = 'test_redis_auth';
    const res = await client.set(key, (new Date()).toISOString());

    console.log(`set ${key}:`, res);

    const res2 = await client.get(key);

    console.log(`get ${key}:`, res2);
}

async function run(opts) {
    if (opts.redis) {
        await testRedis();
    }
}

docoptRunner(docopt(doc), run);

