import config from '../config';
import binanceP2Prequest from '../workers/binanceP2Prequest';
import Queue from './Queue';

export default new Queue({
    ...config.queue.binanceRequest,
    redis : config.queue.redis
}, {
    PROCESS_P2P_REQUEST : binanceP2Prequest
});
