import logger from '../logger';
import binanceP2PQueue from '../queues/binanceP2PQueue';
import cleanupQueue from '../queues/cleanupQueue';
import templates from '../templates';

export default async function () {
    logger.info('STARTING MAIN WORKER');

    await templates.load();

    const p2pjob = await binanceP2PQueue.createJob('WATCH_P2P');

    logger.info({ type: 'WATCH_P2P', job: p2pjob.id });

    const cleanupJob = await cleanupQueue.createJob('RUN_CLEANUP');

    logger.info({ type: 'RUN_CLEANUP', job: cleanupJob.id });

    return {
        WATCH_P2P   : p2pjob.id,
        RUN_CLEANUP : cleanupJob.id
    };
}
