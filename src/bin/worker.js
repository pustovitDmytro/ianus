#!./node_modules/.bin/babel-node
import { docopt } from 'docopt';
import main from '../workers/main';
import { docoptRunner } from './utils';

const doc = `Usage:
    worker.js start
    worker.js -h | --help

    Options:
        -h  --help      Start global platform worker
`;


async function run(opts) {
    if (opts.start) {
        await main();
    }
}

docoptRunner(docopt(doc), run, { noExit: true });

