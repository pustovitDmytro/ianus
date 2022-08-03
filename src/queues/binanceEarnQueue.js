import config from '../etc/config';
import binanceEarn from '../workers/binanceEarn';
import Queue from './Queue';

export default new Queue({
    ...config.queue.binanceEarn,
    redis : config.redis
}, {
    WATCH_EARN : binanceEarn
});
