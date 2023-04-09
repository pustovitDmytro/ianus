import { load } from '../utils';
import seedKupipai from './seeds/kupipai.json';

import {
    setup,
    runMock, runUnmock,
    axiosResponse,
    // axiosError,
    getTestTraceId, trackLogger
} from './utils';

const KupipaiAPIAPI = load('api/KupipaiAPI.js').default;

class MockKupipaiAPIAPI extends KupipaiAPIAPI {
    async _axios() {
        return axiosResponse(seedKupipai);
    }

    log() {
        trackLogger.log(...arguments);
    }

    getTraceId() {
        return getTestTraceId();
    }
}

const CLIENTS = [
    { from: KupipaiAPIAPI, to: MockKupipaiAPIAPI }
];

setup(CLIENTS);

export function mockAPI() {
    runMock(CLIENTS);
}

export function unMockAPI() {
    runUnmock(CLIENTS);
}

