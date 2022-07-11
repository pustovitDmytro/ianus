import { assert } from 'chai';
import '../Test';
import { pause } from 'myrmidon';
import { load } from '../utils';

const Cache = load('Cache').default;
const config = load('etc/config').default;

suite('Unit: Cache');

test('test ttl', async function () {
    const cache = new Cache({
        prefix : '_test_1',
        redis  : config.redis,
        ttl    : 1000
    });

    assert.deepEqual(
        await cache.saveAll([ 'a1', 'a2', 'a3' ]),
        [ 'OK', 'OK', 'OK' ]
    );
    assert.isTrue(await cache.areAllSaved([ 'a2', 'a3' ]));
    assert.isFalse(await cache.areAllSaved([ 'a4', 'a2', 'a3' ]));
    assert.isTrue(await cache.areAllSaved([ 'a1', 'a2', 'a3' ]));

    await pause(1005);

    assert.isFalse(await cache.areAllSaved([ 'a1', 'a2', 'a3' ]));
});
