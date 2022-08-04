import config from '../etc/config';
import binanceSpot from '../workers/binanceSpot';
import Queue from './Queue';

export default new Queue({
    ...config.queue.binanceSpot,
    redis : config.redis
}, {
    WATCH_SPOT : binanceSpot
});
