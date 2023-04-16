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

    pn.progress(0.1, 'Checking cache for saved results');
    if (await cache.areAllSaved(hashes)) return { status: 'ALREADY_NOTIFIED' };

    pn.progress(0.4, 'Found relevant results');
    await telegram.send(user.tgChat, template, {
        user,
        params,
        results : results.slice(0, MAX_RESULTS),
        MAX_RESULTS,
        total   : results.length
    });

    pn.progress(0.8, 'Sent telegram notification');
    await cache.saveAll(hashes);
    pn.progress(1, 'Saved in cache');

    return { status: 'NOTIFIED' };
}
