import KupipaiAPI from '../api/KupipaiAPI';
import Base from './Base/checkRequest';

const PARAMS = [ 'area', 'price', 'perOne', 'rent' ];

export default async function (job) {
    return Base(job, {
        requestParams : data => {
            return {
                session : data.session,
                filters : data.filters
            };
        },
        request : params => {
            const api = new KupipaiAPI(params.session);

            return api.announcements(params.filters);
        },
        isMatching : (item, user) => {
            return PARAMS.every(param => {
                let matching = true;

                if (user.pai[`min_${param}`] && (item[param] < user.pai[`min_${param}`])) matching = false;
                if (user.pai[`max_${param}`] && (item[param] > user.pai[`max_${param}`])) matching = false;

                return matching;
            });
        },
        maxResults : 12,
        jobType    : 'SEND_KUPIPAI_ALARM'
    });
}
