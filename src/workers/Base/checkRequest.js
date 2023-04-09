/* eslint-disable unicorn/filename-case */
import sendAlarmQueue from '../../queues/sendAlarmQueue';
import ProgressNotifier from '../../ProgressNotifier';

export default async function (job, {
    requestParams,
    request,
    isMatching,
    maxResults = 7,
    jobType
}) {
    const pn = new ProgressNotifier();
    const { data } = job;
    const params = requestParams(data);
    const results = await request(params);

    pn.progress(0.3, `Fetched data: ${results.length} items received`);

    const res = [];

    for (const user of data.users) {
        const innerPn = new ProgressNotifier([ 0.3, 0.95 ], pn);
        const matching = results.filter(item => isMatching(item, user, data));
        const userResult = { user, matching: matching.length };

        if (matching.length > 0) {
            const alarmJob = await sendAlarmQueue.createJob(jobType, {
                user,
                params,
                results     : matching,
                MAX_RESULTS : maxResults
            });

            userResult.alarm = alarmJob.id;
        }

        // eslint-disable-next-line sonarjs/no-nested-template-literals
        innerPn.progress(innerPn.arrayIncrement(data.users.length), `User ${user.tgChat} processed. ${userResult.alarm ? `Alarm [${userResult.alarm}] added` : 'no matches found'}`);

        res.push(userResult);
    }

    pn.progress(1, `All (${data.users.length}) users processed`);

    return res;
}
