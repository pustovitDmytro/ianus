/* eslint-disable unicorn/filename-case */
import config from '../etc/config';
import Cache from '../Cache';
import Base from './Base/sendAlarm';

const cache = new Cache({
    prefix : config.cache.p2p.prefix,
    ttl    : config.cache.p2p.ttl,
    redis  : config.redis
});

export default async function (job) {
    return Base(job, {
        cache,
        template : 'BinanceP2PAlarm',
        getHash  : (r, user) => `${user.tgChat}_${r.id}`
    });
}
