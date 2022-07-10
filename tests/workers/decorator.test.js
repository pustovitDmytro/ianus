import { assert } from 'chai';
import Test from '../Test';
import { load, ensureError } from '../utils';

const factory = new Test();
const Queue = load('queues/Queue').default;
const config = load('config').default;

suite('Queue: decorator #redis');

async function successHandler(job) {
    job.log('Some Log');

    return `job result for ${job.data.inner}`;
}

async function failHandler(job) {
    job.log('start handler');

    throw new Error(`job error for ${job.data.inner}`);
}

const testQueue = new Queue({
    name        : 'TEST_QUEUE',
    ttl         : 1000,
    attempts    : 2,
    concurrency : 5,
    logLevel    : 'info',
    canProcess  : true,

    redis : config.queue.redis
}, {
    TEST_JOB_SUCCESS : successHandler,
    TEST_JOB_FAIL    : failHandler
});

before(async function () {
    await factory.dropQueue();
});

test('Positive: check decorator success', async function () {
    const job = await testQueue.createJob(
        'TEST_JOB_SUCCESS',
        { inner: 65 }
    );

    const bullJob = await testQueue.queue.getJob(job.id);

    assert.equal(
        await bullJob.finished(),
        'job result for 65'
    );

    const { logs } = await testQueue.queue.getJobLogs(job.id);

    assert.deepEqual(logs, [ 'Some Log' ]);
});

test('Negative: check decorator failiture', async function () {
    const job = await testQueue.createJob(
        'TEST_JOB_FAIL',
        { inner: 34 }
    );

    const bullJob = await testQueue.queue.getJob(job.id);

    const error = await ensureError(() => bullJob.finished());

    assert.equal(error.toString(), 'Error: job error for 34');

    const { logs } = await testQueue.queue.getJobLogs(job.id);

    assert.deepEqual(logs, [ 'start handler', 'Starting attempt 2', 'start handler' ]);
});

after(async function () {
    await factory.dropQueue();
});
