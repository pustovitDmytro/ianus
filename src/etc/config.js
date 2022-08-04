import dotenv from 'dotenv';
import { Assembler } from 'cottus';
import cottus from '../utils/cottus';

dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.defaults' });

const e = process.env;

const queueSchema = prefix => ({
    name        : { $source: `{${prefix}_NAME}`, $validate: [ 'required', 'string' ] },
    ttl         : { $source: `{${prefix}_TTL}`, $validate: [ 'required', 'time_unit' ] },
    attempts    : { $source: `{${prefix}_ATTEMPTS}`, $validate: [ 'required', 'integer', { 'min': 1 } ] },
    concurrency : { $source: `{${prefix}_CONCURRENCY}`, $validate: [ 'required', 'integer', { 'min': 1 } ] },
    logLevel    : {
        $source   : `{${prefix}_LOG_LEVEL}`,
        $validate : [ 'required', { 'enum': [ 'error', 'warn', 'info', 'notice', 'verbose', 'debug' ] } ]
    },
    repeat     : !!e[`${prefix}_REPEAT`] ? { $source: `{${prefix}_REPEAT}`, $validate: [ 'cron' ] } : null,
    canProcess : { $source: `{${prefix}_PROCESS}`, $validate: [ 'required', 'boolean' ] },
    backoff    : !!e[`${prefix}_BACKOFF_TYPE`] ? {
        type  : { $source: `{${prefix}_BACKOFF_TYPE}`, $validate: [ { 'enum': [ 'exponential' ] } ] },
        delay : { $source: `{${prefix}_BACKOFF_DELAY}`, $validate: [ 'string' ] }
    } : null,
    autoremove : { $source: `{${prefix}_KEEP_LAST}`, $validate: [ 'integer', { min: 0 } ] }
});

const cacheSchema = prefix => ({
    prefix : { $source: `{${prefix}_PREFIX}`, $validate: [ 'required', 'string' ] },
    ttl    : { $source: `{${prefix}_TTL}`, $validate: [ 'required', 'time_unit' ] }
});

const schema = {
    mongo : !!e.MONGO_CONNECTION_STRING ? {
        url : { $source: '{MONGO_CONNECTION_STRING}', $validate: [ 'required', 'url' ] },
        db  : { $source: '{MONGO_DB_NAME}', $validate: [ 'required', 'string' ] }
    } : null,
    redis : {
        port     : { $source: '{REDIS_PORT}', $validate: [ 'required', 'port' ] },
        host     : { $source: '{REDIS_HOST}', $validate: [ 'required', 'hostname' ] },
        db       : { $source: '{REDIS_DB}', $validate: [ 'integer' ] },
        password : { $source: '{REDIS_PASSWORD}', $validate: [ 'string' ] },
        username : { $source: '{REDIS_USER}', $validate: [ 'string' ] }
    },
    queue : {
        binanceP2P     : queueSchema('BINANCE_P2P_QUEUE'),
        binanceEarn    : queueSchema('BINANCE_EARN_QUEUE'),
        binanceSpot    : queueSchema('BINANCE_SPOT_QUEUE'),
        binanceRequest : queueSchema('BINANCE_REQUEST_QUEUE'),
        sendAlarm      : queueSchema('SEND_ALARM_QUEUE'),
        cleanup        : queueSchema('CLEANUP_QUEUE')
    },
    cache : {
        spot : cacheSchema('SPOT_ALARM_CACHE'),
        earn : cacheSchema('EARN_ALARM_CACHE'),
        p2p  : cacheSchema('P2P_ALARM_CACHE')
    },
    binanceP2PList : {
        $source   : { type: 'complex_array', prefix: 'BINANCE_P2P_LIST_' },
        $validate : {
            'user' : {
                'tgChat' : { $source: '{_USER_TG_CHAT}', $validate: [ 'required', 'integer' ] },
                'limit'  : { $source: '{_LIMIT}', $validate: [ 'required', 'number' ] }
            },
            'asset'    : { $source: '{_ASSET}', $validate: [ 'required', 'string' ] },
            'fiat'     : { $source: '{_FIAT}', $validate: [ 'required', 'string' ] },
            'payTypes' : {
                $source : '{_PAY_TYPES}', $validate : [ 'required', { 'split': ' ' }, { every: 'string' } ]
            }
        }
    },
    web : {
        port  : { $source: '{PORT}', $validate: [ 'required', 'port' ] },
        start : { $source: '{WEB_START}', $validate: [ 'required', 'boolean' ] },
        admin : {
            password : { $source: '{BASIC_ADMIN_PASSWORD}', $validate: [ 'required', 'string' ] }
        }
    },
    telegram : {
        botId    : { $source: '{TELEGRAM_BOT_ID}', $validate: [ 'required', 'integer' ] },
        botToken : { $source: '{TELEGRAM_BOT_TOKEN}', $validate: [ 'required', 'string', { min: 35 }, { max: 35 } ] }
    },
    shutdown : {
        forceTimeout : { $source: '{FORCE_TIMEOUT_EXIT}', $validate: [ 'required', 'time_unit' ] }
    }
};

const assembler = new Assembler(cottus, schema);

assembler.parse();
const config = assembler.run(e);

export default config;
