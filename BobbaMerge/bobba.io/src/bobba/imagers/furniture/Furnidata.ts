export interface FurniDescription {
    classname: string,
    name: string,
    description: string
}

export interface Furnidata {
    roomitemtypes: FurniDictionary,
    wallitemtypes: FurniDictionary
}

export interface FurniDictionary {
    [id: number]: FurniDescription;
}