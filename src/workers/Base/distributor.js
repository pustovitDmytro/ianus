/* eslint-disable unicorn/filename-case */
import ProgressNotifier from '../../ProgressNotifier';

export default async function ({
    listLoader,
    inputHash,
    queue,
    jobType,
    getUserData = input => input.user,
    getJobData
}) {
    const jobData = [];
    const pn = new ProgressNotifier();
    const items = await listLoader.load();

    pn.progress(0.3, `List Data Loaded: ${items.length} items found`);

    for (const input of items) {
        const hash = inputHash(input, items);
        const exist = jobData.find(j => j.hash === hash);

        if (exist) {
            exist.users.push(getUserData(input));
        } else {
            jobData.push({
                hash,
                ...getJobData(input, hash)
            });
        }
    }

    if (items.length === 0) return;

    pn.progress(0.6, `${jobData.length} jobs recognized`);

    const jobs = [];

    for (const { hash, ...data } of jobData) {
        const innerPn = new ProgressNotifier([ 0.6, 0.95 ], pn);

        const job = await queue.createJob(jobType, data);

        innerPn.progress(innerPn.arrayIncrement(jobData.length), `${jobType} job [${job.id}] created for ${hash}`);

        jobs.push({ jobId: job.id, hash });
    }

    pn.progress(1, `${jobData.length} ${jobType} jobs created`);

    return jobs;
}
