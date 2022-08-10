/* eslint-disable unicorn/filename-case */
import BinanceP2PAPI from '../api/BinanceP2PAPI';
import Base from './Base/binanceRequest';

const api = new BinanceP2PAPI();

const MIN_RATE = 0.92;

export default async function (job) {
    return Base(job, {
        requestParams : data => ({
            asset     : data.asset,
            fiat      : data.fiat,
            payTypes  : data.payTypes,
            tradeType : data.tradeType
        }),
        request    : params => api.p2p(params),
        isMatching : (item, user, data) => {
            const sign = data.tradeType === 'BUY' ? 1 : -1;

            return (item.price - user.limit) * sign <= 0
                    && item.advertiser.rate > MIN_RATE;
        },
        jobType : 'SEND_P2P_ALARM'
    });
}
