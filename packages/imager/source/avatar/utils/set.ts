import SetPart from './setPart';
import PartType from './partType';

export default class Set {

    private id: number;
    private name: String;
    private gender: String;
    private club: number;
    private colorable: boolean;
    private selectable: boolean;
    private preselectable: boolean;

    private parts: Map<PartType, SetPart[]>;
    private hiddenLayers: PartType[] = [];

    constructor(id: number, name: String, gender: String, club: number, colorable: boolean, selectable: boolean, preselectable: boolean){
        this.id = id;
        this.name = name;
        this.gender = gender;
        this.club = club;
        this.colorable = colorable;
        this.selectable = selectable;
        this.preselectable = preselectable;
    }

    public addPart(part: SetPart) {

        if(!this.parts.has(part.getType()))
            this.parts.set(part.getType(), []);
        
        this.parts.get(part.getType()).push(part);
    }

    public addHidenLayer(layer: PartType){
        this.hiddenLayers.push(layer);
    }

    public getId(): number {
        return this.id;
    }

    public getName(): String {
        return this.name;
    }

    public getGender(): String {
        return this.gender;
    }

    public getClub(): number {
        return this.club;
    }

    public getColorable(): boolean {
        return this.colorable;
    }

    public getSelectable(): boolean {
        return this.selectable;
    }

    public getPreselectable(): boolean {
        return this.preselectable;
    }

    public getParts(): Map<PartType, SetPart[]> {
        return this.parts;
    }

    public getHiddenLayers(): PartType[] {
        return this.hiddenLayers;
    }
}