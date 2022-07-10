
import path from 'path';
import API_ERROR from 'base-api-client/lib/Error';
import { getNamespace } from 'cls-hooked';

import ArrayTransport from 'winston-array-transport';
import { createLogger, format, transports } from 'winston';
// import seeds from 'seeds';

const trackTransports = [];

export const trackedLogs = [];

const { TRACK_REQUESTS, TRACK_REQUESTS_TO_STDOUT } = process.env;

if (TRACK_REQUESTS_TO_STDOUT) {
    trackTransports.push(new transports.Console());
}

if (TRACK_REQUESTS) {
    trackTransports.push(new transports.File({
        filename : path.resolve(process.cwd(), TRACK_REQUESTS)
    }));
}

trackTransports.push(new ArrayTransport({ array: trackedLogs, json: true }));

export const trackLogger = createLogger({
    format : format.combine(
        format.timestamp(),
        format.json()
    ),
    transports : trackTransports,
    level      : 'debug'
});

export function setup(CLIENTS) {
    for (const client of CLIENTS) {
        client.backup = {};
        client.methods = Object.getOwnPropertyNames(client.to.prototype).filter(m => m !== 'constructor');

        client.methods.forEach(methodName => {
            client.backup[methodName] = client.from.prototype[methodName];
        });
    }
}

export function runMock(CLIENTS) {
    CLIENTS.forEach(client => {
        client.methods.forEach(methodName => {
            // eslint-disable-next-line no-param-reassign
            client.from.prototype[methodName] = client.to.prototype[methodName];
        });
    });
}

export function runUnmock(CLIENTS) {
    CLIENTS.forEach(client => {
        client.methods.forEach(methodName => {
            // eslint-disable-next-line no-param-reassign
            client.to.prototype[methodName] = client.from.prototype[methodName];
        });
    });
}


export function axiosResponse(data) {
    return { data };
}

export function axiosError(message, data) {
    const err = new Error(message);

    err.response = { data };

    return new API_ERROR(err);
}

export function getTestTraceId() {
    return getNamespace('__TEST__').get('current')?.id;
}
