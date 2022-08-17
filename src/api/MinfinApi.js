import BaseAPI from 'base-api-client';
import { load } from 'cheerio';

export default class MinfinAPI extends BaseAPI {
    constructor() {
        super('https://minfin.com.ua/ua');
    }

    async auction({
        asset, // usd
        town, // poltava kiev
        tradeType  // buy sell
    }) {
        const html = await this.get(`currency/auction/${asset}/${tradeType}/${town}/`);
        const $ = load(html);
        const header = $('.exchanges-page-header');
        const trade = header.find(`.${tradeType}`);
        const rate = trade.find('span.cardHeadlineL');
        const txt = rate[0].children.find(t => t.type === 'text').data;

        return +txt.replace(',', '.');
    }
}
