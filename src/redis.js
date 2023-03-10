import Redis from 'ioredis';
import config from './etc/config';
import logger from './logger';

export default function getClient(opts) {
    const redis = config.redis;

    const client = new Redis({
        port     : redis.port,
        host     : redis.host,
        db       : redis.db,
        password : redis.password,
        username : redis.username || null,

        tls            : redis.tls ? {} : null,
        connectTimeout : redis.connectTimeout,

        ...opts
    });

    client.on('error', e => logger.error({ service: 'redis', ...e }));
    client.on('connect', () => logger.log('verbose', 'redis connected'));

    return client;
}
