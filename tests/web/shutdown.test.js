import '../Test';
import { pause } from 'myrmidon';
import { assert } from 'chai';
import { load } from '../utils';

const { default:shutdown } = load('shutdown');

suite('shutdown #redis');
const old = process.exit;

const codes = [];

before(async function () {
    shutdown.register('test', async (code) => {
        if (code === 5) await pause(3000);
    });
    process.exit = (code) => codes.push(code);
});

test('shutdown succeed', async function () {
    shutdown.isShuttingDown = false;
    await shutdown.run();
    assert.deepEqual(codes, [ 0 ]);
});

test('force shutdown', async function () {
    shutdown.isShuttingDown = false;
    await shutdown.run(5);
    assert.deepEqual(codes, [ 0, 2, 2, 5 ]);
});

after(async function () {
    process.exit = old;
    shutdown.isShuttingDown = false;
});
