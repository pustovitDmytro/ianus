import { assert } from 'chai';
import '../Test';
import { load } from '../utils';

const ProgressNotifier = load('ProgressNotifier').default;

suite('Unit: ProgressNotifier');

test('calcArray', async function () {
    const pn = new ProgressNotifier([ 0.1, 0.2 ]);

    assert.equal(pn.calcArray(4, 0, 0), 0.1);
    assert.equal(pn.calcArray(4, 0, 0.5), 0.1125);
    assert.equal(pn.calcArray(4, 0, 1), 0.125);

    assert.equal(pn.calcArray(4, 1, 0), 0.125);
    assert.equal(pn.calcArray(4, 1, 0.5), 0.1375);
    assert.equal(pn.calcArray(4, 1, 1), 0.15);

    assert.equal(pn.calcArray(4, 3, 1), 0.2);
});
