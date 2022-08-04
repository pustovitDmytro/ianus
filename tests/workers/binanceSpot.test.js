import { assert } from 'chai';
import Test from '../Test';
import { load } from '../utils';
import { Job } from '../mock/Job';

const factory = new Test();
const handler = load('workers/binanceSpot').default;

suite('Workers: binanceSpot [WATCH_SPOT] #redis');

before(async function () {
    await factory.dropQueue();
});

test('binanceSpot worker', async function () {
    const job = new Job({});
    const res = await handler(job);

    assert.deepEqual(res, 1);
});


after(async function () {
    await factory.dropQueue();
});
