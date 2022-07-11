/* eslint-disable unicorn/filename-case */
import ms from 'ms';
import telegram from '../telegram';
import config from '../etc/config';
import Cache from '../Cache';

const cache = new Cache({
    prefix : 'ianus_p2p_cache_',
    ttl    : ms('30min'),
    redis  : config.redis
});

export default async function (job) {
    const { data } = job;
    const { user, params, results, MAX_RESULTS } = data;
    const hashes = results.map(r => `${user.tgChat}_${r.id}}`);

    if (await cache.areAllSaved(hashes)) return { status: 'ALREADY_NOTIFIED' };

    await telegram.send(user.tgChat, 'BinanceP2PAlarm', { MAX_RESULTS, user, params, results });

    await cache.saveAll(hashes);

    return { status: 'NOTIFIED' };
}
