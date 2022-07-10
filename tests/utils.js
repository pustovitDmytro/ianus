import path from 'path';
import { assert } from 'chai';
import { entry } from './constants';

export function load(relPath, clearCache) {
    const absPath = path.resolve(entry, relPath);

    if (clearCache) delete require.cache[require.resolve(absPath)];
    // eslint-disable-next-line security/detect-non-literal-require
    const result =  require(absPath);

    if (clearCache) delete require.cache[require.resolve(absPath)];

    return result;
}

export function resolve(relPath) {
    return require.resolve(path.join(entry, relPath));
}

export async function ensureError(handler) {
    try {
        await handler();
        assert.fail('Expected to throw an error');
    } catch (error)  {
        if (error.name === 'AssertionError') throw error;

        return error;
    }
}
