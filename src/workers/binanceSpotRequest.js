/* eslint-disable unicorn/filename-case */
import BinanceAPI from '../api/BinanceAPI';
import sendAlarmQueue from '../queues/sendAlarmQueue';
import ProgressNotifier from '../ProgressNotifier';

const api = new BinanceAPI();

export default async function (job) {
    const pn = new ProgressNotifier();
    const { data } = job;
    const results = await api.spot();

    pn.progress(0.3, `Fetched spot data from binance: ${results.length} tickers received`);

    const res = [];

    for (const user of data.users) {
        const innerPn = new ProgressNotifier([ 0.3, 0.95 ], pn);
        const sign = user.type === 'LESS' ? 1 : -1;

        const matching = results.filter(item => (user.asset === item.asset) && ((item.price - user.limit) * sign <= 0));

        const userResult = { user, matching: matching.length };

        if (matching.length > 0) {
            const alarmJob = await sendAlarmQueue.createJob('SEND_SPOT_ALARM', {
                user,
                params  : { asset: user.asset },
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
