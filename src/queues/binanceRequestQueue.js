import config from '../etc/config';
import binanceP2PRequest from '../workers/binanceP2PRequest';
import binanceEarnRequest from '../workers/binanceEarnRequest';
import Queue from './Queue';

export default new Queue({
    ...config.queue.binanceRequest,
    redis : config.redis
}, {
    PROCESS_P2P_REQUEST  : binanceP2PRequest,
    PROCESS_EARN_REQUEST : binanceEarnRequest
});
