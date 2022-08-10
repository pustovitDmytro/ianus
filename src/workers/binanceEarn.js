/* eslint-disable unicorn/filename-case */
import binanceRequestQueue from '../queues/binanceRequestQueue';
import BinanceEarnList from '../lists/binanceEarn';
import Base from './Base/distributor';

function inputHash(p) {
    return `${p.asset}`;
}

const listLoader = new BinanceEarnList();

export default async function () {
    return Base({
        listLoader,
        inputHash,
        queue      : binanceRequestQueue,
        jobType    : 'PROCESS_EARN_REQUEST',
        getJobData : input => ({
            asset : input.asset,
            users : [ input.user ]
        })
    });
}
