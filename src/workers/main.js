import logger from '../logger';
import binanceP2PQueue from '../queues/binanceP2PQueue';
import binanceEarnQueue from '../queues/binanceEarnQueue';
import cleanupQueue from '../queues/cleanupQueue';
import templates from '../templates';

export default async function () {
    logger.info('STARTING MAIN WORKER');

    await templates.load();

    const p2pjob = await binanceP2PQueue.createJob('WATCH_P2P');

    logger.info({ type: 'WATCH_P2P', job: p2pjob.id });

    const earnjob = await binanceEarnQueue.createJob('WATCH_EARN');

    logger.info({ type: 'WATCH_EARN', job: earnjob.id });

    const cleanupJob = await cleanupQueue.createJob('RUN_CLEANUP');

    logger.info({ type: 'RUN_CLEANUP', job: cleanupJob.id });

    return {
        WATCH_P2P   : p2pjob.id,
        WATCH_EARN  : earnjob.id,
        RUN_CLEANUP : cleanupJob.id
    };
}
