import config from '../etc/config';
import kupipaiRequest from '../workers/kupipaiRequest';
import Queue from './Queue';

export default new Queue({
    ...config.queue.kupipaiRequest,
    redis : config.redis
}, {
    PROCESS_KUPIPAI_REQUEST : kupipaiRequest
});
