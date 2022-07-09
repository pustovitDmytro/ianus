import cottus from 'cottus';
import BaseRule from 'cottus/lib/rules/Base.js';

class Split extends BaseRule {
    static schema = 'split';

    validate(input) {
        const symbol = this.params;

        return input.split(symbol);
    }
}

cottus.addRules([
    Split
]);

export default cottus;
