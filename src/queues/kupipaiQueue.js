import config from '../etc/config';
import kupipaiDistributor from '../workers/kupipaiDistributor';
import Queue from './Queue';

export default new Queue({
    ...config.queue.kupipai,
    redis : config.redis
}, {
    WATCH_KUPIPAI : kupipaiDistributor
});
