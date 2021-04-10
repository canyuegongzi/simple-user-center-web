export default class Rule {
  public required!: boolean;
  public trigger!: string;
  public message!: string;
  public validator?: (rule: Rule, value: string, callback: (error?: Error) => void) => void;

  constructor({required = true, trigger = 'blur', message = ''},
              validator?: (rule: Rule, value: string, callback: (error?: Error) => void) => void) {
    this.required = required;
    this.trigger = trigger;
    this.message = message;
    if (validator) {
      this.validator = validator;
    }
  }
}
