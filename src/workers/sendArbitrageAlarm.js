/* eslint-disable unicorn/filename-case */
import config from '../etc/config';
import Cache from '../Cache';
import Base from './Base/sendAlarm';

const cache = new Cache({
    prefix : config.cache.arbitrage.prefix,
    ttl    : config.cache.arbitrage.ttl
});

export default async function (job) {
    return Base(job, {
        cache,
        template : 'ArbitrageAlarm',
        getHash  : (r, user, params) => `${user.tgChat}_${params.sell.provider}_${params.buy.provider}`
    });
}
