import Test from '../Test';
import request from '../request';

const factory = new Test();

suite('Bull board #web #redis');

before(async function () {
    await factory.dropQueue();
});

test('Negative: no-auth', async function () {
    await request
        .get('/admin/bull')
        .expect(401)
        .expect('WWW-Authenticate', 'Basic realm="401"');
});

test('Negative: invalid creds', async function () {
    await request
        .get('/admin/bull')
        .auth('user', 'password')
        .expect(401);
});

test('Positive: admin creds', async function () {
    await request
        .get('/admin/bull')
        .auth('admin', process.env.BASIC_ADMIN_PASSWORD)
        .expect(200)
        .expect('Content-Type', 'text/html; charset=utf-8');
});

after(async function () {
    await factory.dropQueue();
});
