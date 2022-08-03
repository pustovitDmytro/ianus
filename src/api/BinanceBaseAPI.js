import BaseAPI from 'base-api-client';

export default class BinanceBaseAPI extends BaseAPI {
    onError(error) {
        if (error.response?.data) {
            const { message, code } = error.response.data;

            throw new Error(`${message} [${code}]`);
        }

        super.onError(error);
    }
}
