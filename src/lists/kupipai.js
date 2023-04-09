import DataLoader from './Loader';

export default class KupipaiList extends DataLoader {
    static envPrefix = 'KUPIPAI_LIST_';

    static envSchema = {
        'user' : {
            'tgChat'  : { $source: '{_USER_TG_CHAT}', $validate: [ 'required', 'integer' ] },
            'session' : { $source: '{_SESSION}', $validate: [ 'required', 'string' ] }
        },
        'pai' : {
            'min_area'   : { $source: '{_MIN_AREA}', $validate: [ 'integer' ] },
            'max_area'   : { $source: '{_MAX_AREA}', $validate: [ 'integer' ] },
            'min_price'  : { $source: '{_MIN_PRICE}', $validate: [ 'integer' ] },
            'max_price'  : { $source: '{_MAX_PRICE}', $validate: [ 'integer' ] },
            'min_perOne' : { $source: '{_MIN_PER_ONE}', $validate: [ 'integer' ] },
            'max_perOne' : { $source: '{_MAX_PER_ONE}', $validate: [ 'integer' ] },
            'min_rent'   : { $source: '{_MIN_RENT}', $validate: [ 'integer' ] },
            'max_rent'   : { $source: '{_MAX_RENT}', $validate: [ 'integer' ] }
        }
    };

    static mongoSchema = {
        'user' : {
            'tgChat'  : { $source: '{telegram_chat}', $validate: [ 'required', 'integer' ] },
            'session' : { $source: '{session}', $validate: [ 'required', 'string' ] }
        },
        'pai' : {
            'min_area'   : { $source: '{min_area}', $validate: [ 'integer' ] },
            'max_area'   : { $source: '{max_area}', $validate: [ 'integer' ] },
            'min_price'  : { $source: '{min_price}', $validate: [ 'integer' ] },
            'max_price'  : { $source: '{max_price}', $validate: [ 'integer' ] },
            'min_perOne' : { $source: '{min_per_one}', $validate: [ 'integer' ] },
            'max_perOne' : { $source: '{max_per_one}', $validate: [ 'integer' ] },
            'min_rent'   : { $source: '{min_rent}', $validate: [ 'integer' ] },
            'max_rent'   : { $source: '{max_rent}', $validate: [ 'integer' ] }
        }
    };

    static collectionName = 'kupipai_list';
}

