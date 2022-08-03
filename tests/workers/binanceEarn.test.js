import { assert } from 'chai';
import Test from '../Test';
import { load } from '../utils';
import { Job } from '../mock/Job';

const factory = new Test();
const handler = load('workers/binanceEarn').default;

suite('Workers: binanceEarn [WATCH_P2P] #redis');

before(async function () {
    await factory.dropQueue();
});

test('binanceEarn worker', async function () {
    const job = new Job({});
    const res = await handler(job);

    assert.deepEqual(
        res.map(r => r.hash),
        [ 'BNB' ]
    );
});


after(async function () {
    await factory.dropQueue();
});
