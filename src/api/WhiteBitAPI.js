import BaseAPI from 'base-api-client';
import { logDecorator }  from '../logger';

@logDecorator({ level: 'verbose' })
export default class WhiteBitAPI extends BaseAPI {
    constructor() {
        super('https://whitebit.com');
    }

    async spot() {
        const res = await this.get('/api/v4/public/ticker');

        return Object.entries(res)
            .map(([ symbol, attributes ]) => dumpTicker({
                ...attributes,
                symbol
            }));
    }
}

function dumpTicker(ticker) {
    return {
        asset : ticker.symbol,
        price : +ticker.last_price
    };
}
