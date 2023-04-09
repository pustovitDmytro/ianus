import BaseAPI from 'base-api-client';
import dayjs from 'dayjs';
import { logDecorator }  from '../logger';

@logDecorator({ level: 'verbose' })
export default class KupipaiAPI extends BaseAPI {
    constructor() {
        super('https://kupipai.com.ua');
    }

    async announcements(filters) {
        const { area, price, perOne, rent } = filters;

        const params = {
            area  : `${area.min}-${area.max}`,
            price : `${price.min}-${price.max}`,

            'price_per_one' : `${perOne.min}-${perOne.max}`,
            'rental_yield'  : `${rent.min}-${rent.max}`,

            status : 3
        };

        const query = Object.entries(params).map(
            ([ key, value ]) => `;${key}=${value}`
        ).join('');

        const res = await this.get(`/api/v1/announcement/list/${query}/`, { limit: 100 });

        return res.data.items.map(d => dumpPai(d));
    }
}

function dumpPai(pai) {
    return {
        identifier : pai.identifier,
        cadastre   : pai.cadastre,
        link       : `https://kupipai.com.ua/profile/announcement/${pai.id}/`,

        area   : pai.area,
        rent   : +pai.rentalYield,
        price  : pai.price,
        perOne : pai.price / pai.area,

        location : pai.koatuuLocation,
        date     : dayjs(pai.createdAt).format('DD MMMM')
    };
}
