import binanceRequestQueue from '../queues/binanceRequestQueue';
import ArbitrageList from '../lists/arbitrage';
import Base from './Base/distributor';

function providerHash(p) {
    return `${p.provider}_${p.asset}_${p.town}`;
}

function inputHash(p) {
    return `${providerHash(p.buy)}_${providerHash(p.sell)}`;
}

const listLoader = new ArbitrageList();

export default async function () {
    return Base({
        listLoader,
        inputHash,
        queue      : binanceRequestQueue,
        jobType    : 'PROCESS_ARBITRAGE_REQUEST',
        getJobData : input => ({
            buy   : input.buy,
            sell  : input.sell,
            users : [ input.user ]
        })
    });
}
