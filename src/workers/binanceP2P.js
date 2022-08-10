/* eslint-disable unicorn/filename-case */
import binanceRequestQueue from '../queues/binanceRequestQueue';
import BinanceP2PList from '../lists/binanceP2P';
import Base from './Base/distributor';

function inputHash(p) {
    return `${p.tradeType}__${p.asset}__${p.fiat}__${p.payTypes.join('_')}`;
}

const listLoader = new BinanceP2PList();

export default async function () {
    return Base({
        listLoader,
        inputHash,
        queue      : binanceRequestQueue,
        jobType    : 'PROCESS_P2P_REQUEST',
        getJobData : input => ({
            asset     : input.asset,
            fiat      : input.fiat,
            payTypes  : input.payTypes,
            tradeType : input.tradeType,
            users     : [ input.user ]
        })
    });
}
