/* eslint-disable unicorn/filename-case */
import binanceRequestQueue from '../queues/binanceRequestQueue';
import BinanceP2PList from '../lists/binanceP2P';

function inputHash(p) {
    return `${p.asset }__${p.fiat}__${p.payTypes.join('_')}`;
}

const listLoader = new BinanceP2PList();

export default async function () {
    const jobData = [];
    const items = await listLoader.load();

    for (const input of items) {
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
