/* eslint-disable unicorn/filename-case */
import telegram from '../../telegram';
import ProgressNotifier from '../../ProgressNotifier';

export default async function (job, {
    cache,
    template,
    getHash
}) {
    const pn = new ProgressNotifier();
    const { data } = job;
    const {
        user,
        params,
        results,
        MAX_RESULTS = 10
    } = data;

    const hashes = results
        .slice(0, MAX_RESULTS)
        .map(r => getHash(r, user, params));

    if (job.attemptsMade >= 1) {
        pn.progress(0.05, 'Refreshing redis client');
        await cache.reconnect();
    }

    pn.progress(0.1, 'Checking cache for saved results');

    if (await cache.areAllSaved(hashes)) return { status: 'ALREADY_NOTIFIED' };

    pn.progress(0.4, 'Found relevant results');

    await telegram.send(user.tgChat, template, { user, params, results, MAX_RESULTS });

    pn.progress(0.8, 'Sent telegram notification');

    await cache.saveAll(hashes);
    pn.progress(1, 'Saved in cache');
    await cache.close();

    return { status: 'NOTIFIED' };
}
