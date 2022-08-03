import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import { logDecorator }  from '../logger';
import BaseAPI from './BinanceBaseAPI';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const PAGE_LIMIT = 20;

export default class BinanceAPI extends BaseAPI {
    constructor() {
        super('https://www.binance.com');
    }

    @logDecorator({ level: 'verbose' })
    async earn({ asset }) {
        const res = await this.get('/bapi/earn/v2/friendly/pos/union', {
            status   : 'ALL',
            pageSize : PAGE_LIMIT,
            asset
        });

        const items = [];

        for (const ass of res.data) {
            for (const p of ass.projects) {
                if (!p.sellOut) {
                    items.push(dumpEarn(p));
                }
            }
        }

        return items;
    }
}


function dumpEarn(p) {
    return {
        id     : p.id,
        asset  : p.asset,
        amount : {
            min : +p.config.minPurchaseAmount,
            max : +p.config.maxPurchaseAmountPerUser
        },
        duration : dayjs.duration(+p.duration, 'days').humanize(),
        rate     : +p.config.annualInterestRate
    };
}

