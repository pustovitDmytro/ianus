import { assert } from 'chai';
import Test from '../Test';
import { load } from '../utils';
import { mockAPI as mockBinance, unMockAPI as unmockBinance } from '../mock/Binance';
import { Job } from '../mock/Job';

const factory = new Test();
const handler = load('workers/binanceSpotRequest').default;

suite('Workers: binanceSpotRequest [PROCESS_SPOT_REQUEST] #redis');

before(async function () {
    mockBinance();
    await factory.dropQueue();
});

test('binanceSpotRequest', async function () {
    const data = {
        users : [
            { limit: 400, tgChat: 103, asset: 'BNBBUSD', type: 'LESS' },
            { limit: 42, tgChat: 104, asset: 'USDTUAH', type: 'MORE' },
            { limit: 42, tgChat: 105, asset: 'BUSDUAH', type: 'LESS' }
        ]
    };

    const job = new Job(data);
    const res = await handler(job);

    assert.deepEqual(res, [
        {
            user : {
                limit  : 400,
                tgChat : 103,
                asset  : 'BNBBUSD',
                type   : 'LESS'
            },
            matching : 1,
            alarm    : '1'
        },
        {
            user : {
                limit  : 42,
                tgChat : 104,
                asset  : 'USDTUAH',
                type   : 'MORE'
            },
            matching : 0
        },
        {
            user : {
                limit  : 42,
                tgChat : 105,
                asset  : 'BUSDUAH',
                type   : 'LESS'
            },
            matching : 1,
            alarm    : '2'
        }
    ]);
});

after(async function () {
    await factory.dropQueue();
    unmockBinance();
});
