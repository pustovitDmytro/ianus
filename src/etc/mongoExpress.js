/* eslint-disable no-magic-numbers */
import crypto from 'crypto';
import config from './config';

const randomSize = 200;
const randomBytes = crypto.randomBytes(randomSize);
const randomString = randomBytes.toString('hex');
const secretLength = 15;

export default {
    mongodb : {
        connectionString : config.mongo?.url.href,

        connectionOptions : {
            ssl           : true,
            sslValidate   : true,
            autoReconnect : true,
            poolSize      : 4
        },

        admin     : true,
        whitelist : [],
        blacklist : []
    },

    site : {
        baseUrl       : '/admin/mongo',
        cookieKeyName : 'mongo-express',
        cookieSecret  : randomString.slice(0, secretLength),
        sessionSecret : randomString.slice(secretLength, 2 * secretLength)
    },

    options : {
        console           : true,
        documentsPerPage  : 10,
        editorTheme       : 'rubyblue', // http://codemirror.net/demo/theme.html
        maxPropSize       : 100_000, // 100KB
        maxRowSize        : 1_000_000, // 1MB
        cmdType           : 'eval',
        subprocessTimeout : 300,

        collapsibleJSON              : true,
        collapsibleJSONDefaultUnfold : 1,

        gridFSEnabled : true,
        confirmDelete : true,

        noExport : false,

        noDelete : false
    },

    defaultKeyNames : {}
};
