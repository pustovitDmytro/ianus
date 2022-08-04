import { assert } from 'chai';
import Test from '../Test';
import { load } from '../utils';

const factory = new Test();
const handler = load('workers/cleanup').default;

suite('Workers: cleanup #redis');

before(async function () {
    await factory.dropQueue();
});

test('run cleanup handler', async function () {
    const res = await handler();

    assert.deepInclude(res, {
        'send-alarm'        : null,
        'binance-request'   : 0,
        'binance-p2p-main'  : 0,
        'binance-earn-main' : 0,
        'binance-spot-main' : 0,
        'cleanup-jobs'      : 0
    });
});

after(async function () {
    await factory.dropQueue();
});
