import { assert } from 'chai';
import Test from '../Test';
import { load } from '../utils';
import { mockAPI as mockTg, unMockAPI as unmockTg } from '../mock/Telegram';
import { Job } from '../mock/Job';

const factory = new Test();
const handler = load('workers/sendEarnAlarm').default;

suite('Workers: sendEarnAlarm [SEND_EARN_ALARM] #redis');

before(async function () {
    mockTg();
    await factory.dropQueue();
});

test('sendEarnAlarm', async function () {
    const data = {
        'user'    : { 'limit': 1.01, 'tgChat': 103 },
        'params'  : { 'asset': 'BNB' },
        'results' : [ {
            id       : '961',
            asset    : 'BNB',
            amount   : { min: 0.001, max: 0.5 },
            duration : '4 months',
            rate     : 0.1299
        } ]
    };

    const job = new Job(data);
    const res = await handler(job);

    assert.deepEqual(res, { status: 'NOTIFIED' });

    const apiCalls = await factory.getApiCalls('type=requestSent&url=sendMessage');

    assert.lengthOf(apiCalls, 1);
    assert.deepEqual(apiCalls.map(i => i.data.chat_id), [ 103 ]);
    const req = apiCalls[0];

    assert.include(req.data.text, '1 projects found:');
});

test('sendEarnAlarm message is cached', async function () {
    const data = {
        'user'    : { 'limit': 1.01, 'tgChat': 103 },
        'params'  : { 'asset': 'BNB' },
        'results' : [ {
            id       : '8932',
            asset    : 'BNB',
            amount   : { min: 0.001, max: 0.5 },
            duration : '4 months',
            rate     : 0.1299
        } ]
    };

    const job = new Job(data);
    const notify = await handler(job);

    assert.deepEqual(notify, { status: 'NOTIFIED' });

    const apiCalls = await factory.getApiCalls('type=requestSent&url=sendMessage');

    assert.lengthOf(apiCalls, 1);
    assert.deepEqual(apiCalls.map(i => i.data.chat_id), [ 103 ]);
    const req = apiCalls[0];

    assert.include(req.data.text, '1 projects found:');

    const cached = await handler(job);

    assert.deepEqual(cached, { status: 'ALREADY_NOTIFIED' });
    assert.lengthOf(await factory.getApiCalls('type=requestSent&url=sendMessage'), 1);
});

after(async function () {
    await factory.dropQueue();
    unmockTg();
});
