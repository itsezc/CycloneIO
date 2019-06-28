import Action from "./action";

export default class Actions {

    static readonly CARRY = new Action("crr", "Carry an item");
    static readonly DRINK = new Action("drk", "Drink an item");
    static readonly STAND = new Action("std", "Stand, default");
    static readonly SIT = new Action("sit", "Sit on the floor");
    static readonly LAY = new Action("lay", "Lay on the floor");
    static readonly WALK = new Action("wlk", "Taking a step");
    static readonly WAVE = new Action("wav", "Waving");

    private static readonly illegalMapping: Map<Action, Action[]> = new Map([
        [Actions.CARRY, [Actions.SIT, Actions.LAY, Actions.WALK]],
        [Actions.SIT, [Actions.STAND, Actions.LAY, Actions.WALK]],
        [Actions.LAY, [Actions.STAND, Actions.SIT, Actions.LAY, Actions.WALK]],
        [Actions.WALK, [Actions.STAND, Actions.SIT, Actions.LAY]],
        [Actions.WAVE, [Actions.LAY]]
    ])

    public static illegalCombination(firstAction: Action, secondAction: Action): Boolean {
        
        if(Actions.illegalMapping.has(firstAction)){
            return Actions.illegalMapping.get(firstAction).includes(secondAction);
        }

        return false;
    }
}