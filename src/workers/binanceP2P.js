/* eslint-disable unicorn/filename-case */
import binanceRequestQueue from '../queues/binanceRequestQueue';
import BinanceP2PList from '../lists/binanceP2P';
import ProgressNotifier from '../ProgressNotifier';

function inputHash(p) {
    return `${p.tradeType}__${p.asset}__${p.fiat}__${p.payTypes.join('_')}`;
}

const listLoader = new BinanceP2PList();

export default async function () {
    const jobData = [];
    const pn = new ProgressNotifier();
    const items = await listLoader.load();

    pn.progress(0.3, `List Data Loaded: ${items.length} items found`);

    for (const input of items) {
        const hash = inputHash(input);
        const exist = jobData.find(j => j.hash === hash);

        if (exist) {
            exist.users.push(input.user);
        } else {
            jobData.push({
                hash,
                asset     : input.asset,
                fiat      : input.fiat,
                payTypes  : input.payTypes,
                tradeType : input.tradeType,
                users     : [ input.user ]
            });
        }
    }

    pn.progress(0.6, `${jobData.length} jobs recognized`);

    const jobs = [];

    for (const { hash, ...data } of jobData) {
        const innerPn = new ProgressNotifier([ 0.6, 0.95 ], pn);

        const job = await binanceRequestQueue.createJob('PROCESS_P2P_REQUEST', data);

        innerPn.progress(innerPn.arrayIncrement(jobData.length), `PROCESS_P2P_REQUEST job [${job.id}] created for ${hash}`);

        jobs.push({ jobId: job.id, hash });
    }

    pn.progress(1, `${jobData.length} PROCESS_P2P_REQUEST jobs created`);

    return jobs;
}
