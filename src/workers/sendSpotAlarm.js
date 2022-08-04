/* eslint-disable unicorn/filename-case */
import telegram from '../telegram';
import config from '../etc/config';
import Cache from '../Cache';
import ProgressNotifier from '../ProgressNotifier';

const cache = new Cache({
    prefix : config.cache.spot.prefix,
    ttl    : config.cache.spot.ttl,
    redis  : config.redis
});

export default async function (job) {
    const pn = new ProgressNotifier();
    const { data } = job;
    const { user, params, results } = data;
    const hashes = [ `${user.tgChat}_${params.asset}` ];

    pn.progress(0.1, 'Checking cache for saved results');

    if (await cache.areAllSaved(hashes)) return { status: 'ALREADY_NOTIFIED' };

    pn.progress(0.4, 'Found relevant results');

    await telegram.send(user.tgChat, 'BinanceSpotAlarm', { user, params, results });

    pn.progress(0.8, 'Sent telegram notification');

    await cache.saveAll(hashes);
    pn.progress(1, 'Saved in cache');

    return { status: 'NOTIFIED' };
}
