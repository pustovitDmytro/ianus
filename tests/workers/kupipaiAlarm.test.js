import { assert } from 'chai';
import Test from '../Test';
import { load } from '../utils';
import { mockAPI, unMockAPI } from '../mock/Telegram';
import { Job } from '../mock/Job';

const factory = new Test();
const handler = load('workers/sendKupipaiAlarm').default;

suite('Workers: kupipaiAlarm [SEND_KUPIPAI_ALARM] #redis');

before(async function () {
    mockAPI();
    await factory.dropQueue();
});

test('kupipaiAlarm', async function () {
    const user = {
        tgChat : 107,
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
        user,
        params : {
            area   : { min: 2, max: 11 },
            price  : { min: 100_000, max: 400_000 },
            perOne : { min: 0, max: 50_000 },
            rent   : { min: 3, max: 100 }
        },
        results : [ {
            identifier : 'AD-19102021-422',
            cadastre   : '6523287700:07:001:0079',
            link       : 'https://kupipai.com.ua/profile/announcement/422/',
            area       : 5.2518,
            rent       : 3.2,
            price      : 200_000,
            perOne     : 38_082.181_347_347_58,
            location   : 'Мирненська, Скадовський, Херсонська, Україна',
            date       : '19 October'
        } ]
    };

    const job = new Job(data);
    const res = await handler(job);

    assert.deepEqual(res, { status: 'NOTIFIED' });

    const apiCalls = await factory.getApiCalls('type=requestSent&url=sendMessage');

    assert.lengthOf(apiCalls, 1);
    assert.deepEqual(apiCalls.map(i => i.data.chat_id), [ 107 ]);
    const req = apiCalls[0];

    assert.include(req.data.text, 'Kupipai Alert hit the target');
    assert.include(req.data.text, '<b>Cadastre:</b> <pre>6523287700:07:001:0079</pre>');
});

after(async function () {
    await factory.dropQueue();
    unMockAPI();
});
