/* eslint-disable unicorn/filename-case */
import BinanceP2PAPI from '../api/BinanceP2PAPI';
import sendAlarmQueue from '../queues/sendAlarmQueue';

const api = new BinanceP2PAPI();

const MIN_RATE = 0.92;

export default async function (job) {
    const { data } = job;

    const params = {
        asset     : data.asset,
        fiat      : data.fiat,
        payTypes  : data.payTypes,
        tradeType : 'BUY'
    };
    const results = await api.p2p(params);

    const res = [];

    for (const user of data.users) {
        const matching = results.filter(item => item.price <= user.limit && item.advertiser.rate > MIN_RATE);
        const userResult = { user, matching: matching.length };

        if (matching.length > 0) {
            const alarmJob = await sendAlarmQueue.createJob('SEND_P2P_ALARM', {
                MAX_RESULTS : 7,
                user,
                params,
                results     : matching
            });

            userResult.alarm = alarmJob.id;
        }

        res.push(userResult);
    }

    return res;
}
