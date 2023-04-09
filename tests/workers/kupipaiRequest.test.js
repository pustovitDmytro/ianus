import { assert } from 'chai';
import Test from '../Test';
import { load } from '../utils';
import { mockAPI, unMockAPI } from '../mock/Kupipai';
import { Job } from '../mock/Job';

const factory = new Test();
const handler = load('workers/kupipaiRequest').default;

suite('Workers: kupipaiRequest [PROCESS_KUPIPAI_REQUEST] #redis');

before(async function () {
    mockAPI();
    await factory.dropQueue();
});

test('kupipaiRequest', async function () {
    const user = {
        tgChat : 103,
        pai    : {
            'min_area' : 3,
            'max_area' : 11,

            'min_price' : 100_000,
            'max_price' : 400_000,

            'min_perOne' : 30_000,
            'min_rent'   : 4,

            'max_perOne' : 40_000
        }
    };
    const data = {
        filters : {
            area   : { min: 2, max: 11 },
            price  : { min: 100_000, max: 400_000 },
            perOne : { min: 0, max: 50_000 },
            rent   : { min: 3, max: 100 }
        },
        users : [ user ]
    };

    const job = new Job(data);
    const res = await handler(job);

    assert.lengthOf(res, 1);

    assert.deepOwnInclude(
        res[0],
        {
            user,
            matching : 9
        }
    );
});

after(async function () {
    await factory.dropQueue();
    unMockAPI();
});
