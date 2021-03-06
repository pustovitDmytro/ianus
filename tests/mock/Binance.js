import { load } from '../utils';
import uahPage1 from './seeds/binanceP2P_UAH_page1.json';
import uahPage2 from './seeds/binanceP2P_UAH_page2.json';
import usd from './seeds/binanceP2P_USD.json';

import {
    setup,
    runMock, runUnmock,
    axiosResponse,
    getTestTraceId, trackLogger
} from './utils';

const BinanceP2PAPI = load('api/BinanceP2PAPI.js').default;

class MockBinanceP2PAPI extends BinanceP2PAPI {
    async _axios(opts) {
        if (opts.url.match('/bapi/c2c/v2/friendly/c2c/adv/search')) {
            if (opts.data.fiat === 'USD') return axiosResponse(usd);
            if (opts.data.fiat === 'UAH') {
                if (opts.data.page === 1) return axiosResponse(uahPage1);

                return axiosResponse(uahPage2);
            }
        }

        return axiosResponse();
    }

    log() {
        trackLogger.log(...arguments);
    }

    getTraceId() {
        return getTestTraceId();
    }
}

const CLIENTS = [
    { from: BinanceP2PAPI, to: MockBinanceP2PAPI }
];

setup(CLIENTS);

export function mockAPI() {
    runMock(CLIENTS);
}

export function unMockAPI() {
    runUnmock(CLIENTS);
}

