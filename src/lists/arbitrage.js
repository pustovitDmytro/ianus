import DataLoader from './Loader';

export default class BinanceSpotList extends DataLoader {
    static envPrefix = 'ARBITRAGE_LIST_';

    static envSchema = {
        'user' : {
            'tgChat' : { $source: '{_USER_TG_CHAT}', $validate: [ 'required', 'integer' ] },
            'limit'  : { $source: '{_LIMIT}', $validate: [ 'required', 'number' ] }
        },
        'sell' : {
            provider  : { $source: '{_PROVIDER}', $validate: [ 'required', { enum: [ 'minfin', 'whitebit', 'binance' ] } ] },
            asset     : { $source: '{_ASSET}', $validate: [ 'required', 'string' ] },
            tradeType : { $source: '{_TRADETYPE}', $validate: [ 'string' ] },
            town      : { $source: '{_TOWN}', $validate: [ 'string' ] }
        },
        'buy' : {
            provider  : { $source: '{_PROVIDER}', $validate: [ 'required', { enum: [ 'minfin', 'whitebit', 'binance' ] } ] },
            asset     : { $source: '{_ASSET}', $validate: [ 'required', 'string' ] },
            tradeType : { $source: '{_TRADETYPE}', $validate: [ 'string' ] },
            town      : { $source: '{_TOWN}', $validate: [ 'string' ] }
        }
    };

    static mongoSchema = {
        'user' : {
            'tgChat' : { $source: '{telegram_chat}', $validate: [ 'required', 'integer' ] },
            'limit'  : { $source: '{limit}', $validate: [ 'required', 'number' ] }
        },
        'sell' : {
            provider  : { $source: '{sell_provider}', $validate: [ 'required', { enum: [ 'minfin', 'whitebit', 'binance' ] } ] },
            asset     : { $source: '{sell_asset}', $validate: [ 'required', 'string' ] },
            tradeType : { $source: '{sell_tradetype}', $validate: [ 'string' ] },
            town      : { $source: '{sell_town}', $validate: [ 'string' ] }
        },
        'buy' : {
            provider  : { $source: '{buy_provider}', $validate: [ 'required', { enum: [ 'minfin', 'whitebit', 'binance' ] } ] },
            asset     : { $source: '{buy_asset}', $validate: [ 'required', 'string' ] },
            tradeType : { $source: '{buy_tradetype}', $validate: [ 'string' ] },
            town      : { $source: '{buy_town}', $validate: [ 'string' ] }
        }
    };

    static collectionName = 'arbitrage_list';
}

