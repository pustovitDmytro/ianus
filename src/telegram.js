
import templates from './templates';
import Api from './api/TelegramAPI';
import config from './config';


class Telegram {
    constructor(c) {
        this.api = new Api(c.botId, c.botToken);
    }

    async send(chat, templateId, data) {
        await templates.load();
        const html = await templates.text(`${templateId}.html`, data);

        await this.api.sendMessage(chat, html);
    }
}

export default new Telegram(config.telegram);
