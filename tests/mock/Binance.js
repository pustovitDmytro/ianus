import { load } from '../utils';
import uahPage1 from './seeds/binanceP2P_UAH_page1.json';
import uahPage2 from './seeds/binanceP2P_UAH_page2.json';
import usd from './seeds/binanceP2P_USD.json';
import bnb from './seeds/binanceEarn_BNB.json';
import binanceSpot from './seeds/binanceSpot';

import {
    setup,
    runMock, runUnmock,
    axiosResponse,
    axiosError,
    getTestTraceId, trackLogger
} from './utils';

const BinanceP2PAPI = load('api/BinanceP2PAPI.js').default;
const BinanceAPI = load('api/BinanceAPI.js').default;

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

class MockBinanceAPI extends BinanceAPI {
    async _axios(opts) {
        if (opts.url.match('/bapi/earn/v2/friendly/pos/union')) {
            if (opts.params.asset === 'ERR') {
                throw axiosError(400, {
                    message : 'Fails',
                    code    : '1111'
                });
            }

            return axiosResponse(bnb);
        }

        if (opts.url.match('/api/v3/ticker/price')) {
            return axiosResponse(binanceSpot);
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
    { from: BinanceP2PAPI, to: MockBinanceP2PAPI },
    { from: BinanceAPI, to: MockBinanceAPI }
];

setup(CLIENTS);

export function mockAPI() {
    runMock(CLIENTS);
}

export function unMockAPI() {
    runUnmock(CLIENTS);
}

