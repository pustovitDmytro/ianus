/* eslint-disable unicorn/filename-case */
import BinanceAPI from '../api/BinanceAPI';
import Base from './Base/checkRequest';

const api = new BinanceAPI();

export default async function (job) {
    return Base(job, {
        requestParams : () => null,
        request       : () => api.spot(),
        isMatching    : (item, user) => {
            const sign = user.type === 'LESS' ? 1 : -1;

            return (user.asset === item.asset) && ((item.price - user.limit) * sign <= 0);
        },
        jobType : 'SEND_SPOT_ALARM'
    });
}
