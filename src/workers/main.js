import logger from '../logger';
import binanceP2PQueue from '../queues/binanceP2PQueue';
import templates from '../templates';

export default async function () {
    logger.info('STARTING MAIN WORKER');

    await templates.load();

    const p2pjob = await binanceP2PQueue.createJob('WATCH_P2P');

    logger.info({ type: 'WATCH_P2P', job: p2pjob.id });
}
