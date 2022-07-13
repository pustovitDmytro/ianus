/* eslint-disable unicorn/filename-case */
import ms from 'ms';
import telegram from '../telegram';
import config from '../etc/config';
import Cache from '../Cache';
import ProgressNotifier from '../ProgressNotifier';

const cache = new Cache({
    prefix : 'ianus_p2p_cache_',
    ttl    : ms('30min'),
    redis  : config.redis
});

export default async function (job) {
    const pn = new ProgressNotifier();
    const { data } = job;
    const { user, params, results, MAX_RESULTS } = data;
    const hashes = results.slice(0, MAX_RESULTS).map(r => `${user.tgChat}_${r.id}}`);

    pn.progress(0.1, 'Checking cache for saved results');

    if (await cache.areAllSaved(hashes)) return { status: 'ALREADY_NOTIFIED' };

    pn.progress(0.4, 'Found relevant results');

    await telegram.send(user.tgChat, 'BinanceP2PAlarm', { MAX_RESULTS, user, params, results });

    pn.progress(0.8, 'Sent telegram notification');

    await cache.saveAll(hashes);
    pn.progress(1, 'Saved in cache');

    return { status: 'NOTIFIED' };
}
