import { RUNNER } from '../namespaces';

export async function docoptRunner(opts, runner, settings = {}) {
    try {
        await new Promise((res, rej) => {
            RUNNER.run(async () => {
                RUNNER.set('notify', {
                    runner    : 'bin',
                    onMessage : msg => console.log(msg)
                });

                Promise.resolve(
                    Reflect.apply(runner, null, [ opts ])
                ).then(res).catch(rej);
            });
        });
        if (!settings.noExit) {
            process.exit(0);
        }
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}
