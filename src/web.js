import express from 'express';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import mongoExpress from '@pustovit/mongo-express/lib/middleware';
import packageInfo from '../package.json';
import config from './etc/config';
import mongoExpressConfig from './etc/mongoExpress';
import logger from './logger';
import Queue from './queues/Queue';
import shutdown from './shutdown';

const queues = Object.values(config.queue).map(conf => Queue.createQuue({
    name  : conf.name,
    redis : config.redis
}));

const serverAdapter = new ExpressAdapter();

createBullBoard({
    queues : queues.map(q => new BullAdapter(q)),
    serverAdapter
});

const app = express();

let server = null;

if (config.web.start) {
    server = app.listen(config.web.port, () => {
        const { port } = server.address();

        logger.info(`WEB STARTING AT PORT ${port}`);
    });
}

export default app;

function bullErrorHandler(error) {
    logger.error({ service: 'ExpressAdapter', error });
}

serverAdapter.setBasePath('/admin/bull');
serverAdapter.setErrorHandler(bullErrorHandler);

const auth = { login: 'admin', password: config.web.admin.password };

function checkBasicAuth(req, res, next) {
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [ login, password ] = Buffer.from(b64auth, 'base64').toString().split(':');

    if (login === auth.login && password === auth.password) {
        return next();
    }

    const noAuthCode = 401;

    res.set('WWW-Authenticate', 'Basic realm="401"');
    res.status(noAuthCode).send('Authentication required');
}

function renderInfo(req, res) {
    res.send({
        name        : packageInfo.name,
        version     : packageInfo.version,
        description : packageInfo.description
    });
}

function renderHealth(req, res) {
    const successCode = 200;

    res.sendStatus(successCode);
}

app.use('/health', renderHealth);
app.use('/admin/bull', checkBasicAuth, serverAdapter.getRouter());
app.use('/admin/info', checkBasicAuth, renderInfo);

async function setupMongo() {
    const middleware = await mongoExpress(mongoExpressConfig);

    app.use('/admin/mongo', checkBasicAuth, middleware);
}

if (config.mongo) setupMongo();

shutdown.register('Web', () => {
    if (server) {
        return new Promise((res) => {
            server.close(res);
        });
    }
});
