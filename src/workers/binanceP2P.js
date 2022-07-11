/* eslint-disable unicorn/filename-case */
import config from '../config';
import binanceRequestQueue from '../queues/binanceRequestQueue';

function inputHash(p) {
    return `${p.asset }__${p.fiat}__${p.payTypes.join('_')}`;
}

export default async function () {
    const jobData = [];

    for (const input of config.binanceP2PList) {
        const hash = inputHash(input);
        const exist = jobData.find(j => j.hash === hash);

        if (exist) {
            exist.users.push(input.user);
        } else {
            jobData.push({
                hash,
                asset    : input.asset,
                fiat     : input.fiat,
                payTypes : input.payTypes,
                users    : [ input.user ]
            });
        }
    }

    const jobs = [];

    for (const { hash, ...data } of jobData) {
        const job = await binanceRequestQueue.createJob('PROCESS_P2P_REQUEST', data);

        jobs.push({ jobId: job.id, hash });
    }

    return jobs;
}
