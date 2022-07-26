import '../Test';
import { pause } from 'myrmidon';
import { assert } from 'chai';
import { load } from '../utils';

const { default:shutdown } = load('shutdown');

suite('signals');
const old = process.exit;

const codes = [];

before(async function () {
    process.exit = (code) => codes.push(code);
});

test('SIGTERM', async function () {
    codes.length = 0;
    process.emit('SIGTERM');
    await pause(2000);
    assert.deepEqual(codes, [ 0, 2 ]);

    // second time
    process.emit('SIGTERM');
    await pause(2000);
    assert.deepEqual(codes, [ 0, 2 ]);
});

test('unhandledRejection', async function () {
    process.emit('unhandledRejection', new Error('unhandled error'));
    await pause(100);
});

after(async function () {
    await pause(1000);
    process.exit = old;
    shutdown.isShuttingDown = false;
});
