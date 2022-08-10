/* eslint-disable unicorn/filename-case */
import config from '../etc/config';
import Cache from '../Cache';
import Base from './Base/sendAlarm';

const cache = new Cache({
    prefix : config.cache.earn.prefix,
    ttl    : config.cache.earn.ttl,
    redis  : config.redis
});

export default async function (job) {
    return Base(job, {
        cache,
        template : 'BinanceEarnAlarm',
        getHash  : (r, user) => `${user.tgChat}_${r.id}`
    });
}
