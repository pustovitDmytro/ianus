import logger from '../logger';
import binanceP2PQueue from '../queues/binanceP2PQueue';
import binanceEarnQueue from '../queues/binanceEarnQueue';
import binanceSpotQueue from '../queues/binanceSpotQueue';
import cleanupQueue from '../queues/cleanupQueue';
import arbitrageQueue from '../queues/arbitrageQueue';
import kupipaiQueue from '../queues/kupipaiQueue';
import templates from '../templates';

const LIST = [
    { queue: binanceP2PQueue, type: 'WATCH_P2P' },
    { queue: binanceEarnQueue, type: 'WATCH_EARN' },
    { queue: binanceSpotQueue, type: 'WATCH_SPOT' },
    { queue: cleanupQueue, type: 'RUN_CLEANUP' },
    { queue: arbitrageQueue, type: 'WATCH_ARBITRAGE' },
    { queue: kupipaiQueue, type: 'WATCH_KUPIPAI' }
];

export default async function () {
    logger.info('STARTING MAIN WORKER');

    await templates.load();
    const result = {};

    await Promise.all(LIST.map(async start => {
        const job = await start.queue.createJob(start.type);

        logger.info({ type: start.type, job: job.id });
        result[start.type] = job.id;
    }));

    return result;
}
