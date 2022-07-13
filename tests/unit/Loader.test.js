import { assert } from 'chai';
import Test from '../Test';
import { load } from '../utils';

const factory = new Test();

const BinanceLoader = load('lists/binanceP2P.js').default;

suite('Unit: Loader');

before(async function () {
    await factory.setMongoDB('binance_p2p_list');
});

test('BinanceLoader load data', async function () {
    const loader = new BinanceLoader();
    const items = await loader.load();

    assert.deepEqual(items, [
        {
            user     : { tgChat: 123_456_789, limit: 0.99 },
            asset    : 'UAH',
            fiat     : 'UAH',
            payTypes : [ 'Monobank', 'PrivatBank', 'PUMBBank' ]
        },
        {
            user     : { tgChat: 123_456_789, limit: 1 },
            asset    : 'USDT',
            fiat     : 'USD',
            payTypes : [ 'Wise' ]
        }
    ]);
});

after(async function () {
    await factory.dropMongoDB();
});
