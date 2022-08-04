import DataLoader from './Loader';

export default class BinanceSpotList extends DataLoader {
    static envSchema = {
        $source   : { type: 'complex_array', prefix: 'BINANCE_SPOT_LIST_' },
        $validate : {
            'user' : {
                'tgChat' : { $source: '{_USER_TG_CHAT}', $validate: [ 'required', 'integer' ] },
                'limit'  : { $source: '{_LIMIT}', $validate: [ 'required', 'number' ] },
                'asset'  : { $source: '{_ASSET}', $validate: [ 'required', 'string' ] },
                'type'   : { $source: '{_TYPE}', $validate: [ { enum: [ 'MORE', 'LESS' ] }, { default: 'LESS' } ] }

            }
        }
    };

    static mongoSchema = {
        'user' : {
            'tgChat' : { $source: '{telegram_chat}', $validate: [ 'required', 'integer' ] },
            'limit'  : { $source: '{apy_limit}', $validate: [ 'required', 'number' ] },
            'asset'  : { $source: '{asset}', $validate: [ 'required', 'string' ] },
            'type'   : { $source: '{type}', $validate: [ { enum: [ 'MORE', 'LESS' ] }, { default: 'LESS' } ] }

        }
    };

    static collectionName = 'binance_spot_list';
}

