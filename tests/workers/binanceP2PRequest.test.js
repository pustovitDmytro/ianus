/* eslint-disable censor/no-swear */
import { assert } from 'chai';
import Test from '../Test';
import { load } from '../utils';
import { mockAPI as mockBinance, unMockAPI as unmockBinance } from '../mock/Binance';
import { mockAPI as mockTg, unMockAPI as unmockTg } from '../mock/Telegram';
import { Job } from '../mock/Job';

const factory = new Test();
const handler = load('workers/binanceP2PRequest').default;


suite('Workers: binanceP2PRequest [PROCESS_P2P_REQUEST] #redis');

before(async function () {
    mockBinance();
    mockTg();
    await factory.dropQueue();
});

test('binanceP2PRequest no matches due to limits', async function () {
    const data = {
        asset    : 'USDT',
        fiat     : 'USD',
        payTypes : [ 'Wise' ],
        users    : [
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
        asset    : 'UAH',
        fiat     : 'UAH',
        payTypes : [ 'PrivatBank', 'PUMBBank' ],
        users    : [
            { limit: 1.01, tgChat: 103 },
            { limit: 1.02, tgChat: 104 }
        ]
    };

    const job = new Job(data);
    const res = await handler(job);

    assert.deepEqual(res, [
        { user: { limit: 1.01, tgChat: 103 }, matching: 2 },
        { user: { limit: 1.02, tgChat: 104 }, matching: 22 }
    ]);

    const apiCalls = await factory.getApiCalls('type=requestSent&url=sendMessage');

    assert.lengthOf(apiCalls, 2);
    assert.deepEqual(apiCalls.map(i => i.data.chat_id), [ 103, 104 ]);
    const bigMath = apiCalls.find(a => a.data.chat_id === 104);

    assert.include(bigMath.data.text, 'Top 7 (of 22) positions:');

    const smallMath = apiCalls.find(a => a.data.chat_id === 103);

    assert.include(smallMath.data.text, '2 advertisements found:');
});

after(async function () {
    await factory.dropQueue();
    unmockBinance();
    unmockTg();
});
