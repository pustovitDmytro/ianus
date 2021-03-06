import config from '../etc/config';
import sendP2PAlarm from '../workers/sendP2PAlarm';
import Queue from './Queue';

export default new Queue({
    ...config.queue.sendAlarm,
    redis : config.redis
}, {
    SEND_P2P_ALARM : sendP2PAlarm
});
