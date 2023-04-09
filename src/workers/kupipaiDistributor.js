import kupipaiRequestQueue from '../queues/kupipaiRequestQueue';
import List from '../lists/kupipai';
import Base from './Base/distributor';

const PARAMS = [ 'area', 'price', 'perOne', 'rent' ];

function commonHash(items) {
    const params = {};

    PARAMS.forEach(p => params[p] = {});

    const defaultParams = {
        area   : { min: 0, max: 100 },
        price  : { min: 0, max: 1_000_000 * 100 },
        perOne : { min: 0, max: 1_000_000 },
        rent   : { min: 0, max: 100 }
    };

    PARAMS.forEach(param => {
        for (const { pai } of items) {
            const min = pai[`min_${param}`];
            const max = pai[`max_${param}`];

            if (min && (!params[param].min || min < params[param].min)) params[param].min =  min;
            if (max && (!params[param].max || max > params[param].max)) params[param].max =  max;
        }

        if (!params[param].min) params[param].min = defaultParams[param].min;
        if (!params[param].max) params[param].max = defaultParams[param].max;
    });

    return JSON.stringify(params);
}

function inputHash(p, items) {
    return commonHash(items);
}

const listLoader = new List();

function getUserData(input) {
    return {
        tgChat : input.user.tgChat,
        pai    : input.pai
    };
}

export default async function () {
    return Base({
        listLoader,
        inputHash,
        queue      : kupipaiRequestQueue,
        jobType    : 'PROCESS_KUPIPAI_REQUEST',
        getUserData,
        getJobData : (input, hash) => ({
            filters : JSON.parse(hash),
            users   : [ getUserData(input) ]
        })
    });
}
