import Actions from './actions'

export default class Action {

    private key: string;
    private description: String;

    constructor(key: string, description: String) {
        this.key = key;
        this.description = description;
    }

    public getKey(): string {
        return this.key
    }

    public getDescription(): String {
        return this.description;
    }

    public illegalCombination(secondAction: Action): Boolean {
        return Actions.illegalCombination(this, secondAction);
    }
}