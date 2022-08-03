import { logDecorator }  from '../logger';
import BaseAPI from './BinanceBaseAPI';

const PAGE_LIMIT = 20;

export default class BinanceAPI extends BaseAPI {
    constructor() {
        super('https://p2p.binance.com');
    }

    getHeaders() {
        return { 'Content-Type': 'application/json' };
    }

    @logDecorator({ level: 'verbose' })
    async p2p({ page = 1, ...params }) {
        const res = await this.post('/bapi/c2c/v2/friendly/c2c/adv/search',  {
            page,
            rows          : PAGE_LIMIT,
            publisherType : null,
            ...params
        });

        const items = res.data.map(item => dumpP2P(item));
        const prevFetched = (page - 1) * PAGE_LIMIT;

        if (items.length > 0 && (res.total > prevFetched + items.length)) {
            return [
                ...items,
                ...(await this.p2p({
                    ...params,
                    page : page + 1
                }))
            ];
        }


        return items;
    }
}


function dumpP2P(p) {
    const { adv, advertiser } = p;

    return {
        id        : adv.advNo,
        asset     : adv.asset,
        tradeType : adv.tradeType,
        fiat      : adv.fiatUnit,
        price     : adv.price,
        amount    : {
            max  : adv.maxSingleTransAmount,
            min  : adv.minSingleTransAmount,
            init : adv.initAmount
        },
        advertiser : {
            id    : advertiser.userNo,
            nick  : advertiser.nickName,
            rate  : advertiser.monthFinishRate,
            count : advertiser.monthOrderCount
        },
        tradeMethods : adv.tradeMethods.map(m => m.identifier)
    };
}

