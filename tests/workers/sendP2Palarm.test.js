import { assert } from 'chai';
import Test from '../Test';
import { load } from '../utils';
import { mockAPI as mockTg, unMockAPI as unmockTg } from '../mock/Telegram';
import { Job } from '../mock/Job';

const factory = new Test();
const handler = load('workers/sendP2PAlarm').default;

suite('Workers: sendP2PAlarm [SEND_P2P_ALARM] #redis');

before(async function () {
    mockTg();
    await factory.dropQueue();
});

test('sendP2PAlarm not cached', async function () {
    const data = {
        'MAX_RESULTS' : 7,
        'user'        : { 'limit': 1.01, 'tgChat': 103 },
        'params'      : { 'asset': 'UAH', 'fiat': 'UAH', 'payTypes': [ 'PrivatBank', 'PUMBBank' ], 'tradeType': 'BUY' },
        'results'     : [ { 'id': '11379042615181037568', 'asset': 'UAH', 'tradeType': 'SELL', 'fiat': 'UAH', 'price': '1.01', 'amount': { 'max': '4470.00', 'min': '1500.00', 'init': '4382.59000000' }, 'advertiser': { 'id': 's746671c16e4e39bc84ea5c0b40f67869', 'nick': 'lingvomap', 'rate': 1, 'count': 1 }, 'tradeMethods': [ 'Monobank' ] }, { 'id': '11378824080204775424', 'asset': 'UAH', 'tradeType': 'SELL', 'fiat': 'UAH', 'price': '1.01', 'amount': { 'max': '50000.00', 'min': '100.00', 'init': '24159.34000000' }, 'advertiser': { 'id': 'sf900b249de483eb58dfeef51181d4494', 'nick': 'elxeon', 'rate': 0.981_981_981_981_981_9, 'count': 654 }, 'tradeMethods': [ 'Monobank' ] } ]
    };

    const job = new Job(data);
    const res = await handler(job);

    assert.deepEqual(res, { status: 'NOTIFIED' });

    const apiCalls = await factory.getApiCalls('type=requestSent&url=sendMessage');

    assert.lengthOf(apiCalls, 1);
    assert.deepEqual(apiCalls.map(i => i.data.chat_id), [ 103 ]);
    const req = apiCalls[0];

    assert.include(req.data.text, '2 advertisements found:');
});

test('sendP2PAlarm message is cached', async function () {
    const data = {
        'MAX_RESULTS' : 7,
        'user'        : { 'limit': 1.01, 'tgChat': 103 },
        'params'      : { 'asset': 'UAH', 'fiat': 'UAH', 'payTypes': [ 'PrivatBank', 'PUMBBank' ], 'tradeType': 'BUY' },
        'results'     : [ { 'id': '111111', 'asset': 'UAH', 'tradeType': 'SELL', 'fiat': 'UAH', 'price': '1.01', 'amount': { 'max': '4470.00', 'min': '1500.00', 'init': '4382.59000000' }, 'advertiser': { 'id': 's746671c16e4e39bc84ea5c0b40f67869', 'nick': 'lingvomap', 'rate': 1, 'count': 1 }, 'tradeMethods': [ 'Monobank' ] } ]
    };

    const job = new Job(data);
    const notify = await handler(job);

    assert.deepEqual(notify, { status: 'NOTIFIED' });

    const apiCalls = await factory.getApiCalls('type=requestSent&url=sendMessage');

    assert.lengthOf(apiCalls, 1);
    assert.deepEqual(apiCalls.map(i => i.data.chat_id), [ 103 ]);
    const req = apiCalls[0];

    assert.include(req.data.text, '1 advertisements found:');

    const cached = await handler(job);

    assert.deepEqual(cached, { status: 'ALREADY_NOTIFIED' });
    assert.lengthOf(await factory.getApiCalls('type=requestSent&url=sendMessage'), 1);
});

after(async function () {
    await factory.dropQueue();
    unmockTg();
});
