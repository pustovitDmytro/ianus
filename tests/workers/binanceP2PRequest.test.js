import { assert } from 'chai';
import Test from '../Test';
import { load } from '../utils';
import { mockAPI as mockBinance, unMockAPI as unmockBinance } from '../mock/Binance';
import { Job } from '../mock/Job';

const factory = new Test();
const handler = load('workers/binanceP2PRequest').default;


suite('Workers: binanceP2PRequest [PROCESS_P2P_REQUEST] #redis');

before(async function () {
    mockBinance();
    await factory.dropQueue();
});

test('binanceP2PRequest no matches due to limits', async function () {
    const data = {
        asset     : 'USDT',
        fiat      : 'USD',
        payTypes  : [ 'Wise' ],
        tradeType : 'BUY',
        users     : [
            { limit: 1.001, tgChat: 101 },
            { limit: 1.005, tgChat: 102 }
        ]
    };

    const job = new Job(data);
    const res = await handler(job);

    assert.deepEqual(res, [
        { user: { limit: 1.001, tgChat: 101 }, matching: 0 },
        { user: { limit: 1.005, tgChat: 102 }, matching: 0 }
    ]);
});

test('binanceP2PRequest matches found', async function () {
    const data = {
        asset     : 'UAH',
        fiat      : 'UAH',
        tradeType : 'BUY',
        payTypes  : [ 'PrivatBank', 'PUMBBank' ],
        users     : [
            { limit: 1.01, tgChat: 103 },
            { limit: 1.02, tgChat: 104 }
        ]
    };

    const job = new Job(data);
    const res = await handler(job);

    assert.deepEqual(res, [
        { user: { limit: 1.01, tgChat: 103 }, matching: 2, 'alarm': '1' },
        { user: { limit: 1.02, tgChat: 104 }, matching: 23, 'alarm': '2' }
    ]);
});

test('binanceP2PRequest SELL', async function () {
    const data = {
        asset     : 'UAH',
        fiat      : 'UAH',
        tradeType : 'SELL',
        payTypes  : [ 'PrivatBank', 'PUMBBank' ],
        users     : [
            { limit: 1.04, tgChat: 105 }
        ]
    };

    const job = new Job(data);
    const res = await handler(job);

    assert.deepEqual(res, [
        { user: { limit: 1.04, tgChat: 105 }, matching: 0 }
    ]);
});

after(async function () {
    await factory.dropQueue();
    unmockBinance();
});
