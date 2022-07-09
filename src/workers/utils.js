/* eslint-disable sonarjs/prefer-immediate-return */
import { RUNNER } from '../namespaces';
import { logDecorator }  from '../logger';

export function getJobRunner(runner, { level, name }) {
    const decoratorConfig = {
        level,
        paramsSanitizer : params => params[0].toJSON(),
        methodName      : name
    };

    async function jobRunner(job) {
        const result = await new Promise((resolve, reject) => {
            RUNNER.run(async () => {
                const toPercentage = 100;

                RUNNER.set('notify', {
                    runner     : 'bull',
                    onMessage  : msg => job.log(msg),
                    onProgress : p => job.progress(p * toPercentage)
                });

                try {
                    if (job.attemptsMade) job.log(`Starting attempt ${job.attemptsMade + 1}`);
                    job.progress(0);
                    const res = await runner(job);

                    job.progress(100); // eslint-disable-line no-magic-numbers

                    return resolve(res);
                } catch (error) {
                    console.error(error);
                    reject(error);
                }
            });
        });

        return result;
    }

    return logDecorator(decoratorConfig)(jobRunner);
}
