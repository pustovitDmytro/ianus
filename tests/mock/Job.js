export class Job {
    constructor(data) {
        this.data = data;
        this._logs = [];
    }

    log(string) {
        this._logs.push(string);
    }
}
