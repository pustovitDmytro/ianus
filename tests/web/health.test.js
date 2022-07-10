import { assert } from 'chai';
import Test from '../Test';
import request from '../request';

const factory = new Test();

suite('Health route #web');

before(async function () {
    await factory.dropQueue();
});

test('Positive: ping health', async function () {
    await request
        .get('/health')
        .expect(200)
        .expect(({ body }) => {
            assert.isEmpty(body);
        });
});

after(async function () {
    await factory.dropQueue();
});
