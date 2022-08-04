import { assert } from 'chai';
import Test from '../Test';
import { load } from '../utils';
import { mockAPI as mockTg, unMockAPI as unmockTg } from '../mock/Telegram';
import { Job } from '../mock/Job';

const factory = new Test();
const handler = load('workers/sendSpotAlarm').default;

suite('Workers: sendSpotAlarm [SEND_SPOT_ALARM] #redis');

before(async function () {
    mockTg();
    await factory.dropQueue();
});

test('sendSpotAlarm', async function () {
    const data = {
        'user'    : { 'limit': 100, 'tgChat': 103 },
        'params'  : { 'asset': 'BNBBUSD' },
        'results' : [ {
            price : 250
        } ]
    };

    const job = new Job(data);
    const res = await handler(job);

    assert.deepEqual(res, { status: 'NOTIFIED' });

    const apiCalls = await factory.getApiCalls('type=requestSent&url=sendMessage');

    assert.lengthOf(apiCalls, 1);
    assert.deepEqual(apiCalls.map(i => i.data.chat_id), [ 103 ]);
    const req = apiCalls[0];

    assert.include(req.data.text, 'BNBBUSD');
    assert.include(req.data.text, '250');
});

test('sendSpotAlarm message is cached', async function () {
    const data = {
        'user'    : { 'limit': 100, 'tgChat': 101 },
        'params'  : { 'asset': 'BNBBUSD' },
        'results' : [ {
            price : 250
        } ]
    };

    const job = new Job(data);
    const notify = await handler(job);

    assert.deepEqual(notify, { status: 'NOTIFIED' });

    const apiCalls = await factory.getApiCalls('type=requestSent&url=sendMessage');

    assert.lengthOf(apiCalls, 1);
    assert.deepEqual(apiCalls.map(i => i.data.chat_id), [ 101 ]);
    const req = apiCalls[0];

    assert.include(req.data.text, 'BNBBUSD');

    const cached = await handler(job);

    assert.deepEqual(cached, { status: 'ALREADY_NOTIFIED' });
    assert.lengthOf(await factory.getApiCalls('type=requestSent&url=sendMessage'), 1);
});

after(async function () {
    await factory.dropQueue();
    unmockTg();
});
