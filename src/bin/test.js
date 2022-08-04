#!./node_modules/.bin/babel-node
import { docopt } from 'docopt';
import binanceEarnRequest from '../workers/binanceEarnRequest';
import binanceSpotRequest from '../workers/binanceSpotRequest';
import { docoptRunner } from './utils';

const doc = `Usage:
    test.js binanceEarnRequest
    test.js binanceSpotRequest
    test.js -h | --help

    Options:
        -h  --help    Test workers
`;

async function testBinanceEarnRequest() {
    await binanceEarnRequest({
        data : {
            asset : 'BNB',
            users : [ { limit: 20 } ]
        }
    });
}

async function testBinanceSpotRequest() {
    await binanceSpotRequest({
        data : {
            users : [ { asset: 'BTCUSDT', limit: 10_000, type: 'MORE' } ]
        }
    });
}

async function run(opts) {
    if (opts.binanceEarnRequest) {
        await testBinanceEarnRequest();
    }

    if (opts.binanceSpotRequest) {
        await testBinanceSpotRequest();
    }
}

docoptRunner(docopt(doc), run, { noExit: true });

