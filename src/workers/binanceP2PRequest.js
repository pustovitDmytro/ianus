/* eslint-disable unicorn/filename-case */
import BinanceP2PAPI from '../api/BinanceP2PAPI';
import sendAlarmQueue from '../queues/sendAlarmQueue';
import ProgressNotifier from '../ProgressNotifier';

const api = new BinanceP2PAPI();

const MIN_RATE = 0.92;

export default async function (job) {
    const pn = new ProgressNotifier();
    const { data } = job;

    const params = {
        asset     : data.asset,
        fiat      : data.fiat,
        payTypes  : data.payTypes,
        tradeType : 'BUY'
    };
    const results = await api.p2p(params);

    pn.progress(0.3, `Fetched p2p data from binance: ${results.length} advertisements received`);

    const res = [];

    for (const user of data.users) {
        const innerPn = new ProgressNotifier([ 0.3, 0.95 ], pn);

        const matching = results.filter(item => item.price <= user.limit && item.advertiser.rate > MIN_RATE);
        const userResult = { user, matching: matching.length };

        if (matching.length > 0) {
            console.log(JSON.stringify({
                MAX_RESULTS : 7,
                user,
                params,
                results     : matching
            }));
            const alarmJob = await sendAlarmQueue.createJob('SEND_P2P_ALARM', {
                MAX_RESULTS : 7,
                user,
                params,
                results     : matching
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
