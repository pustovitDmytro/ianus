/* eslint-disable unicorn/filename-case */
import binanceRequestQueue from '../queues/binanceRequestQueue';
import BinanceSpotList from '../lists/binanceSpot';
import ProgressNotifier from '../ProgressNotifier';

const listLoader = new BinanceSpotList();

export default async function () {
    const jobData = { users: [] };
    const pn = new ProgressNotifier();
    const items = await listLoader.load();

    pn.progress(0.3, `List Data Loaded: ${items.length} items found`);
    if (items.length === 0) return;

    for (const input of items) {
        jobData.users.push(input.user);
    }

    const job = await binanceRequestQueue.createJob('PROCESS_SPOT_REQUEST', jobData);

    pn.progress(1, `PROCESS_SPOT_REQUEST job [${job.id}] created`);

    return items.length;
}
