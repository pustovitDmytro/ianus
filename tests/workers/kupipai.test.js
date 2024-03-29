import { assert } from 'chai';
import Test from '../Test';
import { load } from '../utils';
// import { mockAPI, unMockAPI } from '../mock/Kupipai';
import { Job } from '../mock/Job';

const factory = new Test();
const handler = load('workers/kupipaiDistributor').default;

suite('Workers: kupipai [WATCH_KUPIPAI] #redis');

before(async function () {
    await factory.dropQueue();
});

test('kupipai distributor', async function () {
    const job = new Job({});
    const res = await handler(job);

    assert.lengthOf(res, 2);
    const [ outJob ] = res;
    const { filters, session } = JSON.parse(outJob.hash);

    assert.deepEqual(filters, {
        area   : { min: 2, max: 11 },
        price  : { min: 100_000, max: 400_000 },
        perOne : { min: 0, max: 50_000 },
        rent   : { min: 3, max: 100 }
    });

    assert.exists(session);
});

after(async function () {
    await factory.dropQueue();
});
