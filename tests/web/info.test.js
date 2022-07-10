/* eslint-disable censor/no-swear */
import { assert } from 'chai';
import Test from '../Test';
import request from '../request';

const factory = new Test();

suite('Info Route #web #redis');

before(async function () {
    await factory.dropQueue();
});

test('Negative: invalid creds', async function () {
    await request
        .get('/admin/info')
        .auth('user', 'password')
        .expect(401)
        .expect('WWW-Authenticate', 'Basic realm="401"');
});

test('Positive: admin creds', async function () {
    await request
        .get('/admin/info')
        .auth('admin', process.env.BASIC_ADMIN_PASSWORD)
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(({ body }) => {
            assert.exists(body.version);
            assert.equal(body.name, 'ianus');
        });
});

after(async function () {
    await factory.dropQueue();
});
