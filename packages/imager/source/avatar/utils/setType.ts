import PartType from "./partType";
import Set from './set';

export default class SetType {

    private type: PartType;
    private paletteId: number;
    private sets: Map<number, Set> = new Map();

    constructor(type: PartType, paletteId: number) {
        this.type = type;
        this.paletteId = paletteId;
    }

    public getType(): PartType {
        return this.type;
    }

    public getPaletteId(): number {
        return this.paletteId;
    }

    public getSets(): Map<number, Set> {
        return this.sets;
    }

    public addSet(set: Set){
        this.sets.set(set.getId(), set);
    }
}