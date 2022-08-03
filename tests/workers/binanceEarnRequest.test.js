import { assert } from 'chai';
import Test from '../Test';
import { load } from '../utils';
import { mockAPI as mockBinance, unMockAPI as unmockBinance } from '../mock/Binance';
import { Job } from '../mock/Job';

const factory = new Test();
const handler = load('workers/binanceEarnRequest').default;


suite('Workers: binanceEarnRequest [PROCESS_EARN_REQUEST] #redis');

before(async function () {
    mockBinance();
    await factory.dropQueue();
});

test('binanceEarnRequest', async function () {
    const data = {
        asset : 'BNB',
        users : [
            { limit: 0.12, tgChat: 103 },
            { limit: 0.2, tgChat: 104 }
        ]
    };

    const job = new Job(data);
    const res = await handler(job);

    assert.deepEqual(res, [
        { user: { limit: 0.12, tgChat: 103 }, matching: 1, 'alarm': '1' },
        { user: { limit: 0.2, tgChat: 104 }, matching: 0 }
    ]);
});

test('binanceEarnRequest fails', async function () {
    const data = {
        asset : 'ERR',
        users : [
            { limit: 0.25, tgChat: 104 }
        ]
    };

    const job = new Job(data);

    try {
        await handler(job);
        assert.fail('not reached');
    } catch (error) {
        assert.include(error.toString(), 'Fails [1111]');
    }
});


after(async function () {
    await factory.dropQueue();
    unmockBinance();
});
