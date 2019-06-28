import Actions from './actions'

export default class Action {

    private key: String;
    private description: String;

    constructor(key: String, description: String) {
        this.key = key;
        this.description = description;
    }

    public getKey(): String {
        return this.key
    }

    public getDescription(): String {
        return this.description;
    }

    public illegalCombination(secondAction: Action): Boolean {
        return Actions.illegalCombination(this, secondAction);
    }
}