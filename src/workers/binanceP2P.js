/* eslint-disable unicorn/filename-case */
import config from '../config';
import binanceRequestQueue from '../queues/binanceRequestQueue';

function inputHash(p) {
    return `${p.asset }__${p.fiat}__${p.payTypes.join('_')}`;
}

export default async function () {
    const jobData = [];

    for (const input of config.binanceP2PList) {
        const exist = jobData.find(j => inputHash(j) === inputHash(input));

        if (exist) {
            exist.users.push(input.user);
        } else {
            jobData.push({
                asset    : input.asset,
                fiat     : input.fiat,
                payTypes : input.payTypes,
                users    : [ input.user ]
            });
        }
    }

    const jobs = [];

    for (const data of jobData) {
        await binanceRequestQueue.createJob('PROCESS_P2P_REQUEST', data);
    }

    return jobs;
}
