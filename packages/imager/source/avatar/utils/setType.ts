import PartType from "./partType";

export default class SetType {

    private type: PartType;
    private paletteId: number;
    private sets: Object = {};

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
}