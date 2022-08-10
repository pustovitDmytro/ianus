/* eslint-disable unicorn/filename-case */
import binanceRequestQueue from '../queues/binanceRequestQueue';
import BinanceSpotList from '../lists/binanceSpot';
import Base from './Base/distributor';

const listLoader = new BinanceSpotList();

function inputHash() {
    return '_';
}

export default async function () {
    return Base({
        listLoader,
        inputHash,
        queue      : binanceRequestQueue,
        jobType    : 'PROCESS_SPOT_REQUEST',
        getJobData : input => ({
            users : [ input.user ]
        })
    });
}
