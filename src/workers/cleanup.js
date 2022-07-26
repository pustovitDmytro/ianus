import ProgressNotifier from '../ProgressNotifier';
import { QUEUES } from '../queues/Queue';

export default async function () {
    const pn = new ProgressNotifier();
    const result = {};

    let accum = 0;
    const perQueue = 1 / QUEUES.length;
    const promises = QUEUES.map(async (Queue) => {
        result[Queue.name] = null;
        pn.progress(accum += perQueue * 0.25, `Checking queue ${Queue.name}`);

        if (!Queue.keepLast) {
            return pn.progress(
                accum += perQueue * 0.75,
                `autoremove not configured for ${Queue.name}`
            );
        }

        const jobs = await Queue.findCompletedJobs();

        pn.progress(accum += perQueue * 0.25, `Found ${jobs.length} completed jobs for ${Queue.name}`);

        jobs.sort((a, b) => a.finishedOn - b.finishedOn);
        const needRemove = jobs.slice(Queue.keepLast, jobs.length);

        pn.progress(accum += perQueue * 0.1, `${needRemove.length} jobs will be removed for ${Queue.name}`);

        await Promise.all(needRemove.map(j => j.remove()));
        result[Queue.name] = needRemove.length;
        pn.progress(accum += perQueue * 0.15, `${Queue.keepLast} jobs left for ${Queue.name}`);
    });

    await Promise.all(promises);

    return result;
}
