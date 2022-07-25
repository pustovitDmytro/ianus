import config from '../etc/config';
import cleanup from '../workers/cleanup';
import Queue from './Queue';

export default new Queue({
    ...config.queue.cleanup,
    redis : config.redis
}, {
    RUN_CLEANUP : cleanup
});
