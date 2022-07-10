import { RUNNER } from './namespaces';

export default class ProgressNotifier {
    constructor(range, base) {
        [ this.from = 0, this.to = 1 ] = range || [];
        if (base) {
            const baseLen = base.to - base.from;

            this.from = base.from + this.from * baseLen;
            this.to = base.from + this.to * baseLen;
        }

        const context = RUNNER.get('notify');

        if (context?.onMessage) this.onMessage = context.onMessage;
        if (context?.onProgress) this.onProgress = context.onProgress;
    }

    onMessage() {}

    onProgress() {}

    progress(progress, ...messages) {
        const ranged = this.to - this.from;

        this.onProgress(this.from + ranged * progress);
        for (const message of messages) {
            if (message) this.onMessage(message);
        }
    }

    calcArray(
        arrayLength,
        arrayIndex,
        completionRate
    ) {
        const ranged = (this.to - this.from) / arrayLength;
        const from = this.from + arrayIndex * ranged;

        return from + ranged * completionRate;
    }
}
