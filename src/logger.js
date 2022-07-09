import { Decorator } from 'logger-decorator';
import { createLogger, format, transports } from 'winston';
import { name } from '../package';

/* eslint-disable camelcase */
const { npm_config_loglevel, DEBUG, LOG_LEVEL } = process.env;
/* istanbul ignore next */
const level = LOG_LEVEL || DEBUG && 'debug' || npm_config_loglevel || 'info';
/* eslint-enable camelcase*/

const appNameFormat = format(info => {
    info.application = name; // eslint-disable-line no-param-reassign

    return info;
});

export const LogLeveles = {
    error   : 0,
    warn    : 1,
    info    : 2,
    notice  : 3,
    verbose : 4,
    debug   : 5
};

const logger = createLogger({
    level,
    levels : LogLeveles,
    format : format.combine(
        appNameFormat(),
        format.timestamp(),
        format.json()
    ),
    transports : [ new transports.Console() ]
});

export const logDecorator = new Decorator({
    logger : logger.log.bind(logger),
    level  : 'info'
});

export default logger;

