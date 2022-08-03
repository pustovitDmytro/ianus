import { promisify } from 'util';
import { MongoClient, ServerApiVersion } from 'mongodb';
import { Assembler } from 'cottus';
import config from '../etc/config';
import cottus from '../utils/cottus';

export default class DataLoader {
    async load() {
        if (config.mongo) {
            const raw =  await this.loadMongo();
            const assembler = new Assembler(cottus, this.constructor.mongoSchema);

            assembler.parse();

            return raw.map(r => assembler.run(JSON.parse(JSON.stringify(r))));
        }

        const assembler = new Assembler(cottus, { list: this.constructor.envSchema });

        assembler.parse();

        return assembler.run(process.env).list || [];
    }

    async loadMongo() {
        const client = new MongoClient(
            config.mongo.url.href,
            {
                useNewUrlParser    : true,
                useUnifiedTopology : true,
                serverApi          : ServerApiVersion.v1
            }
        );

        const connect = promisify(client.connect.bind(client));

        await connect();
        const db = client.db(config.mongo.db);

        const collection = db.collection(this.constructor.collectionName);

        const cursor = await collection.find();
        const items = await cursor.toArray();

        await client.close();

        return items;
    }
}

