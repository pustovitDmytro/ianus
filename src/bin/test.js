#!./node_modules/.bin/babel-node
import { docopt } from 'docopt';
import binanceEarnRequest from '../workers/binanceEarnRequest';
import { docoptRunner } from './utils';

const doc = `Usage:
    test.js binanceEarnRequest
    test.js -h | --help

    Options:
        -h  --help
        start           Start global platform worker
        cleanup         Start cleanup job
`;

async function testBinanceEarnRequest() {
    await binanceEarnRequest({
        data : {
            asset : 'BNB',
            users : [ { limit: 20 } ]
        }
    });
}

async function run(opts) {
    if (opts.binanceEarnRequest) {
        await testBinanceEarnRequest();
    }
}

docoptRunner(docopt(doc), run, { noExit: true });

