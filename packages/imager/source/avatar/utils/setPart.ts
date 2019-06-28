import PartType from "./partType";

export default class SetPart {

    private id: number;
    private type: PartType;
    private colorable: boolean;
    private colorIndex: number;

    private order: number;

    constructor(id: number, type: PartType, colorable: boolean, index: number, colorIndex: number){
        this.id = id;
        this.type = type;
        this.colorable = colorable;
        this.colorIndex = colorIndex;

        this.order = type.getOrder();
    }

    public getId(): number {
        return this.id;
    }

    public getType(): PartType {
        return this.type;
    }

    public getColorable(): boolean {
        return this.colorable;
    }

    public getColorIndex(): number {
        return this.colorIndex;
    }

    public getOrder(): number {
        return this.order;
    }

    public setOrder(order: number) {
        this.order = order;
    }
}
