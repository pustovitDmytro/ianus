import DataLoader from './Loader';

export default class BinanceP2PList extends DataLoader {
    static envSchema = {
        $source   : { type: 'complex_array', prefix: 'BINANCE_P2P_LIST_' },
        $validate : {
            'user' : {
                'tgChat' : { $source: '{_USER_TG_CHAT}', $validate: [ 'required', 'integer' ] },
                'limit'  : { $source: '{_LIMIT}', $validate: [ 'required', 'number' ] }
            },
            'tradeType' : { $source: '{_TRADE_TYPE}', $validate: [ { enum: [ 'BUY', 'SELL' ] }, { default: 'BUY' } ] },
            'asset'     : { $source: '{_ASSET}', $validate: [ 'required', 'string' ] },
            'fiat'      : { $source: '{_FIAT}', $validate: [ 'required', 'string' ] },
            'payTypes'  : {
                $source : '{_PAY_TYPES}', $validate : [ 'required', { 'split': ' ' }, { every: 'string' } ]
            }
        }
    };

    static mongoSchema = {
        'user' : {
            'tgChat' : { $source: '{telegram_chat}', $validate: [ 'required', 'integer' ] },
            'limit'  : { $source: '{price_limit}', $validate: [ 'required', 'number' ] }
        },
        'tradeType' : { $source: '{trade_type}', $validate: [ { enum: [ 'BUY', 'SELL' ] }, { default: 'BUY' } ] },
        'asset'     : { $source: '{asset}', $validate: [ 'required', 'string' ] },
        'fiat'      : { $source: '{fiat}', $validate: [ 'required', 'string' ] },
        'payTypes'  : {
            $source : '{pay_types}', $validate : [ 'required', { 'split': ',' }, { every: 'string' } ]
        }
    };

    static collectionName = 'binance_p2p_list';
}

