/* eslint-disable unicorn/filename-case */
import sendAlarmQueue from '../queues/sendAlarmQueue';
import ProgressNotifier from '../ProgressNotifier';
import BinanceAPI from '../api/BinanceAPI';
import MinfinApi from '../api/MinfinApi';
import WhiteBitAPI from '../api/WhiteBitAPI';

const binanceAPI = new BinanceAPI();
const whiteBitAPI = new WhiteBitAPI();
const minfinApi = new MinfinApi();

async function providerPrice({ provider, asset, ...options }) {
    if (provider === 'minfin') {
        return minfinApi.auction({
            asset,
            town      : options.town,
            tradeType : options.tradeType
        });
    }

    if (provider === 'binance') {
        const tickers = await binanceAPI.spot();

        return tickers.find(t => t.asset === asset).price;
    }

    if (provider === 'whitebit') {
        const tickers = await whiteBitAPI.spot();

        return tickers.find(t => t.asset === asset).price;
    }
}

export default async function (job) {
    const pn = new ProgressNotifier();
    const { data } = job;

    const [ sellPrice, buyPrice ] = await Promise.all([
        providerPrice(data.sell),
        providerPrice(data.buy)
    ]);

    const diff = sellPrice - buyPrice;
    const relative = diff / sellPrice;

    pn.progress(0.3, `Fetched arbitrage prices: ${sellPrice} / ${buyPrice}`);

    const res = [];

    for (const user of data.users) {
        const matching = relative >= user.limit;
        const userResult = { user, matching };

        if (matching) {
            const alarmJob = await sendAlarmQueue.createJob('SEND_ARBITRAGE_ALARM', {
                user,
                params  : data,
                results : [ { relative, diff, sellPrice, buyPrice } ]
            });

            userResult.alarm = alarmJob.id;
        }

        res.push(userResult);
    }

    pn.progress(1, `All (${data.users.length}) users processed`);

    return res;
}
