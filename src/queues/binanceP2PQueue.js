import config from '../etc/config';
import binanceP2P from '../workers/binanceP2P';
import Queue from './Queue';

export default new Queue({
    ...config.queue.binanceP2P,
    redis : config.redis
}, {
    WATCH_P2P : binanceP2P
});
