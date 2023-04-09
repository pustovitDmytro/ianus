import Redis from 'ioredis';
import config from './etc/config';
import logger from './logger';

function onError(e) {
    logger.error({ service: 'redis', ...e });
}

function onConnect() {
    logger.log('verbose', 'redis connected');
}

export default function getClient(opts) {
    const redis = config.redis;
    const creds = {};

    if (redis.username) creds.username = redis.username;
    if (redis.password) creds.password = redis.password;

    const client = new Redis({
        port : redis.port,
        host : redis.host,
        db   : redis.db,

        ...creds,

        tls            : redis.tls ? {} : null,
        connectTimeout : redis.connectTimeout,

        ...opts
    });

    client.on('error', onError);
    client.on('connect', onConnect);

    return client;
}
