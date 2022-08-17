import config from '../etc/config';
import arbitrageDistributors from '../workers/arbitrageDistributors';
import Queue from './Queue';

export default new Queue({
    ...config.queue.arbitrage,
    redis : config.redis
}, {
    WATCH_ARBITRAGE : arbitrageDistributors
});
