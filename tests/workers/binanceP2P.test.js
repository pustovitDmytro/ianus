import { assert } from 'chai';
import Test from '../Test';
import { load } from '../utils';
import { Job } from '../mock/Job';

const factory = new Test();
const handler = load('workers/binanceP2P').default;

suite('Workers: binanceP2P [WATCH_P2P] #redis');

before(async function () {
    await factory.dropQueue();
});

test('binanceP2P worker', async function () {
    const job = new Job({});
    const res = await handler(job);

    assert.deepEqual(
        res.map(r => r.hash),
        [ 'BUY__UAH__UAH__Monobank_PrivatBank_PUMBBank', 'BUY__USDT__USD__Wise', 'BUY__UAH__UAH__Monobank' ]
    );
});


after(async function () {
    await factory.dropQueue();
});
