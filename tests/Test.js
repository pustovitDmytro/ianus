import fse from 'fs-extra';
import { getNamespace } from 'cls-hooked';
import jsonQuery from 'json-query';
import { tmpFolder } from './constants';
import { load } from './utils';
import { trackedLogs } from './mock/utils';

import './init-hooks';

const Queue = load('queues/Queue.js').default;

export * from './utils';
// eslint-disable-next-line import/export
export * from './constants';

export default class Test {
    async setTmpFolder() {
        await fse.ensureDir(tmpFolder);
    }

    async cleanTmpFolder() {
        await fse.remove(tmpFolder);
    }

    async dropQueue() {
        await Queue.clean(true);
    }

    async getApiCalls(query, { trace = true } = {}) {
        const ns = getNamespace('__TEST__');
        const queryItems = [];

        if (query)queryItems.push(query);

        if (trace) {
            const traceId = ns.get('current').id;

            queryItems.push(`traceId=${traceId}`);
        }

        const q = `[*${queryItems.join('&')}]`;
        const res = jsonQuery(q, { data: trackedLogs });

        return res.value;
    }
}

