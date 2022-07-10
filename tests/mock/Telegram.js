import { load } from '../utils';
import {
    setup,
    runMock, runUnmock,
    axiosResponse,
    getTestTraceId, trackLogger
} from './utils';

const TelegramAPI = load('api/TelegramAPI.js').default;

class MockTelegramAPI extends TelegramAPI {
    // eslint-disable-next-line sonarjs/cognitive-complexity
    async _axios(opts) {
        if (opts.method === 'POST' && opts.url.match('sendMessage')) {
            return axiosResponse({ result: 1 });
        }

        throw new Error('unknown telegram request');
    }

    log() {
        trackLogger.log(...arguments);
    }

    getTraceId() {
        return getTestTraceId();
    }
}

const CLIENTS = [
    { from: TelegramAPI, to: MockTelegramAPI }
];

setup(CLIENTS);

export function mockAPI() {
    runMock(CLIENTS);
}

export function unMockAPI() {
    runUnmock(CLIENTS);
}

