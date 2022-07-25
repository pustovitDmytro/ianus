#!./node_modules/.bin/babel-node
import { docopt } from 'docopt';
import main from '../workers/main';
import cleanup from '../workers/cleanup';
import { docoptRunner } from './utils';

const doc = `Usage:
    worker.js start
    worker.js cleanup
    worker.js -h | --help

    Options:
        -h  --help
        start           Start global platform worker
        cleanup         Start cleanup job
`;


async function run(opts) {
    if (opts.start) {
        await main();
    }

    if (opts.cleanup) {
        await cleanup();
    }
}

docoptRunner(docopt(doc), run, { noExit: true });

