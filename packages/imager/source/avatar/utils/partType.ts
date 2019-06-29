import BodyLocation from './bodyLocation';

export default class PartType {

    private key: String;
    private bodyLocation: BodyLocation;
    private order: number;
    private coloringFrom: PartType;
    private rotationOffset: number[] = [];

    constructor(key: String, bodyLocation: BodyLocation, order: number, coloringFrom?: PartType){
        this.key = key;
        this.bodyLocation = bodyLocation;
        this.order = order;
        this.coloringFrom = coloringFrom;
    }

    public getKey(): String {
        return this.key;
    }

    public getBodyLocation(): BodyLocation {
        return this.bodyLocation;
    }

    public getOrder(): number {
        return this.order;
    }

    public getColoringFrom(): any {
        return this.coloringFrom;
    }

    public setRotationOffset(key: number, value: number){
        this.rotationOffset[key] = value;
    }

    public getRotationOffset(): number[] {
        return this.rotationOffset;
    }
}