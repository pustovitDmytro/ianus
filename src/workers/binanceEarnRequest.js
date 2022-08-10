/* eslint-disable unicorn/filename-case */
import BinanceAPI from '../api/BinanceAPI';
import Base from './Base/binanceRequest';

const api = new BinanceAPI();

export default async function (job) {
    return Base(job, {
        requestParams : data => ({ asset: data.asset }),
        request       : params => api.earn(params),
        isMatching    : (item, user) => user.limit <= item.rate,
        jobType       : 'SEND_EARN_ALARM'
    });
}
