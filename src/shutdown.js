/* eslint-disable no-process-exit */
import { pause } from 'myrmidon';
import ms from 'ms';
import config from './etc/config';
import logger from './logger';

[ 'SIGINT', 'SIGTERM', 'SIGQUIT', 'SIGHUP' ].forEach(sig => {
    process.on(sig, async () => {
        logger.info(`${sig} signal catched`);
        await shutdown.run();
    });
});

process.on('exit', code => logger.info(`exit: ${code}`));

[ 'unhandledRejection', 'uncaughtException' ].forEach(sig => {
    process.on(sig, error => {
        console.error(error);

        logger.error({
            type  : sig,
            error : error.toString(),
            stack : error.stack
        });
    });
});

function forceShutDown() {
    logger.info('Forced to shut down');
    process.exit(2);
}

class ShutDown {
    isShuttingDown = false;

    handlers = [];

    register(name, handler) {
        this.handlers.push({ name, handler });
    }

    async run(code = 0) {
        if (this.isShuttingDown) return;
        this.isShuttingDown = true;
        setTimeout(forceShutDown, config.shutdown.forceTimeout);

        // eslint-disable-next-line sonarjs/no-empty-collection
        const promises = this.handlers
            .map(async ({ name, handler }) => {
                try {
                    await handler(code);
                    logger.info(`${name} have been shut down`);
                } catch (error) {
                    logger.error({
                        name,
                        type  : 'shutdown error',
                        error : error.toString(),
                        stack : error.stack
                    });
                }
            });

        await Promise.all(promises);
        await pause(ms('1s'));
        process.exit(code);
    }
}

const shutdown = new ShutDown();

export default shutdown;
