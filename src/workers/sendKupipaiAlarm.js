/* eslint-disable unicorn/filename-case */
import config from '../etc/config';
import Cache from '../Cache';
import Base from './Base/sendAlarm';

const cache = new Cache({
    prefix : config.cache.kupipai.prefix,
    ttl    : config.cache.kupipai.ttl
});

export default async function (job) {
    return Base(job, {
        cache,
        template : 'Kupipai',
        getHash  : (r, user) => `${user.tgChat}_${r.identifier}`
    });
}
