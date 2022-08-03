/* eslint-disable unicorn/filename-case */
import BinanceAPI from '../api/BinanceAPI';
import sendAlarmQueue from '../queues/sendAlarmQueue';
import ProgressNotifier from '../ProgressNotifier';

const api = new BinanceAPI();

export default async function (job) {
    const pn = new ProgressNotifier();
    const { data } = job;
    const params = {
        asset : data.asset
    };
    const results = await api.earn(params);

    pn.progress(0.3, `Fetched earn data from binance: ${results.length} projects received`);

    const res = [];

    for (const user of data.users) {
        const innerPn = new ProgressNotifier([ 0.3, 0.95 ], pn);
        const matching = results.filter(item => user.limit <= item.rate);
        const userResult = { user, matching: matching.length };

        if (matching.length > 0) {
            const alarmJob = await sendAlarmQueue.createJob('SEND_EARN_ALARM', {
                user,
                params,
                results : matching
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
