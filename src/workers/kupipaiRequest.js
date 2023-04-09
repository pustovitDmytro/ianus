import KupipaiAPI from '../api/KupipaiAPI';
import Base from './Base/checkRequest';

const api = new KupipaiAPI();

const PARAMS = [ 'area', 'price', 'perOne', 'rent' ];

export default async function (job) {
    return Base(job, {
        requestParams : data => {
            return data.filters;
        },
        request    : params => api.announcements(params),
        isMatching : (item, user) => {
            return PARAMS.every(param => {
                let matching = true;

                if (user.pai[`min_${param}`] && (item[param] < user.pai[`min_${param}`])) matching = false;
                if (user.pai[`max_${param}`] && (item[param] > user.pai[`max_${param}`])) matching = false;

                return matching;
            });
        },
        jobType : 'SEND_KUPIPAI_ALARM'
    });
}
