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
            { limit: 200, tgChat: 103, asset: 'BNBBUSD' },
            { limit: 40, tgChat: 104, asset: 'UAHUSDT', type: 'MORE' }
        ]
    };

    const job = new Job(data);
    const res = await handler(job);

    assert.deepEqual(res, [
        {
            user     : { limit: 200, tgChat: 103, asset: 'BNBBUSD' },
            matching : 0
        },
        {
            user     : { limit: 40, tgChat: 104, asset: 'UAHUSDT', type: 'MORE' },
            matching : 0
        }
    ]);
});

after(async function () {
    await factory.dropQueue();
    unmockBinance();
});
