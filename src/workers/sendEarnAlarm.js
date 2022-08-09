/* eslint-disable unicorn/filename-case */
import telegram from '../telegram';
import config from '../etc/config';
import Cache from '../Cache';
import ProgressNotifier from '../ProgressNotifier';

const cache = new Cache({
    prefix : config.cache.earn.prefix,
    ttl    : config.cache.earn.ttl,
    redis  : config.redis
});

export default async function (job) {
    const pn = new ProgressNotifier();
    const { data } = job;
    const { user, params, results } = data;
    const hashes = results.map(r => `${user.tgChat}_${r.id}`);

    pn.progress(0.1, 'Checking cache for saved results');

    if (await cache.areAllSaved(hashes)) return { status: 'ALREADY_NOTIFIED' };

    pn.progress(0.4, 'Found relevant results');

    await telegram.send(user.tgChat, 'BinanceEarnAlarm', { user, params, results });

    pn.progress(0.8, 'Sent telegram notification');

    await cache.saveAll(hashes);
    pn.progress(1, 'Saved in cache');

    await cache.close();

    return { status: 'NOTIFIED' };
}
