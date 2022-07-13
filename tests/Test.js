import { promisify } from 'util';
import { URL } from 'url';
import fse from 'fs-extra';
import { getNamespace } from 'cls-hooked';
import jsonQuery from 'json-query';
import { MongoClient, ServerApiVersion } from 'mongodb';
import { createClient } from 'redis';
import { tmpFolder } from './constants';
import { load } from './utils';
import { trackedLogs } from './mock/utils';
import './init-hooks';
import binanceP2PList from './fixtures/binance_p2p_list';

const Queue = load('queues/Queue.js').default;
const config = load('etc/config').default;

export const collections = {
    'binance_p2p_list' : binanceP2PList
};

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

        const client = createClient({
            socket : {
                port : config.redis.port,
                host : config.redis.host
            },
            username : config.redis.username,
            password : config.redis.password,
            database : config.redis.database
        });

        await client.connect();
        await client.FLUSHDB();
        await client.quit();
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

    async setMongoDB(collectionName) {
        config.mongo = {
            url : new URL(process.env.TEST_MONGO_CONNECTION_STRING),
            db  : process.env.MONGO_DB_NAME
        };
        this._mongoClient = new MongoClient(
            config.mongo.url.href,
            {
                useNewUrlParser    : true,
                useUnifiedTopology : true,
                serverApi          : ServerApiVersion.v1
            }
        );

        const connect = promisify(this._mongoClient.connect.bind(this._mongoClient));

        await connect();
        const db = this._mongoClient.db(config.mongo.db);

        const collection = db.collection(collectionName);

        await collection.insertMany(collections[collectionName]);
    }

    async dropMongoDB() {
        const db = this._mongoClient.db(config.mongo.db);

        const dbCollections = await db.listCollections();

        for (const collection of await dbCollections.toArray()) {
            await db.dropCollection(collection.name);
        }

        await this._mongoClient.close();
        // eslint-disable-next-line require-atomic-updates
        config.mongo = false;
    }
}
