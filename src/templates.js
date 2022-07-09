import path from 'path';
import fs from 'fs-extra';
import ejs from 'ejs';
import { flatten } from 'myrmidon';
import dayjs from 'dayjs';

const templatesDir = path.join(__dirname, '../templates');

async function getFiles(dir) {
    const subdirs = await fs.readdir(dir);
    const files = await Promise.all(subdirs.map(async (subdir) => {
        const res = path.resolve(dir, subdir);
        const stat  = await fs.stat(res);

        return stat.isDirectory() ? getFiles(res) : res;
    }));

    return flatten(files);
}

function defaultParams() {
    return {
        'current_timestamp' : dayjs().format('DD MMM YYYY, [at] HH:mm [UTC]')
    };
}

export class Templates {
    constructor() {
        this.templates = {};
    }

    async load() {
        const files = await getFiles(templatesDir);

        const promises = files.map(async filePath => {
            const rel = path.relative(templatesDir, filePath);
            const text = await fs.readFile(filePath, 'utf8');

            this.templates[rel] = ejs.compile(text);
        });


        await Promise.all(promises);
    }

    text(templateId, data) {
        const template = this.templates[templateId];

        return template({ ...defaultParams(), ...data });
    }

    // addText(base, templateId) {
    //     return `${base}\n${this.text(templateId)}`;
    // }

    // extract(text, tag = 'Lalaps.description') {
    //     const startTag = `<!-- ${tag}:start -->`;
    //     const endTag = `<!-- ${tag}:end -->`;
    //     const startIndex = text.indexOf(startTag);
    //     const endIndex = text.lastIndexOf(endTag);

    //     if ([ startIndex, endIndex ].includes(-1)) return null;

    //     return text.slice(startIndex + startTag.length, endIndex).trim();
    // }
}

export default new Templates();
