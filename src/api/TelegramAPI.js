/* eslint-disable unicorn/filename-case */
import BaseAPI from 'base-api-client';

export default class TelegramAPI extends BaseAPI {
    constructor(id, token) {
        super(`https://api.telegram.org/bot${id}:${token}`);
    }

    onResponse(res) {
        return res.data.result;
    }

    sendMessage(chatId, html) {
        return this.post('sendMessage', {
            'parse_mode'               : 'HTML',
            'text'                     : html,
            'chat_id'                  : chatId,
            'disable_web_page_preview' : false
        });
    }
}
