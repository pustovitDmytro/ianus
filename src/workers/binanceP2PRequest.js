/* eslint-disable unicorn/filename-case */
import BinanceP2PAPI from '../api/BinanceP2PAPI';
import telegram from '../telegram';

const api = new BinanceP2PAPI();

const MIN_RATE = 0.95;

export default async function (job) {
    const { data } = job;

    const params = {
        asset     : data.asset,
        fiat      : data.fiat,
        payTypes  : data.payTypes,
        tradeType : 'BUY'
    };
    const results = await api.p2p(params);

    const res = [];

    for (const user of data.users) {
        const matching = results.filter(item => item.price <= user.limit && item.advertiser.rate > MIN_RATE);

        res.push({ user, matching: matching.length });
        if (matching.length > 0) {
            await telegram.send(user.tgChat, 'BinanceP2PAlarm', {
                MAX_RESULTS : 7,
                user,
                params,
                results     : matching
            });
        }
    }

    return res;
}
