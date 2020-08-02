export default class Rule {
    constructor({ required = true, trigger = 'blur', message = '' }, validator) {
        this.required = required;
        this.trigger = trigger;
        this.message = message;
        if (validator) {
            this.validator = validator;
        }
    }
}
//# sourceMappingURL=Rule.js.map