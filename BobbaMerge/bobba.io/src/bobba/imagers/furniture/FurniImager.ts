import FurniBase from "./FurniBase";
import FurniAsset from "./FurniAsset";
import { FurniOffset } from "./FurniOffset";
import { Furnidata, FurniDescription } from "./Furnidata";
import { downloadImageAsync } from "../misc/Util";

export const LOCAL_RESOURCES_URL = "http://localhost/outils/FurniToJson/";

export default class FurniImager {
    ready: boolean;
    bases: { roomitem: { [id: string]: Promise<FurniBase> }, wallitem: { [id: string]: Promise<FurniBase> } };
    offsets: { [id: string]: Promise<FurniOffset> };
    furnidata: Furnidata;

    constructor() {
        this.ready = false;
        this.bases = { roomitem: {}, wallitem: {} };
        this.furnidata = { roomitemtypes: {}, wallitemtypes: {} };
        this.offsets = {};
    }

    findItemByName(itemName: string) {
        for (let itemId in this.furnidata.roomitemtypes) {
            const item = this.furnidata.roomitemtypes[itemId];
            if (item.classname === itemName) {
                return { item, type: 'roomitemtypes' };
            }
        }
        for (let itemId in this.furnidata.wallitemtypes) {
            const item = this.furnidata.wallitemtypes[itemId];
            if (item.classname === itemName) {
                return { item, type: 'wallitemtypes' };
            }
        }
        return null;
    }

    findItemById(type: ItemType, itemId: number): FurniDescription | null {
        const furnidataType = type === 'roomitem' ? 'roomitemtypes' : 'wallitemtypes';
        if (this.furnidata[furnidataType][itemId] != null) {
            return this.furnidata[furnidataType][itemId];
        }
        return null;
    }

    async loadItemBase(type: ItemType, itemId: number): Promise<FurniBase> {
        const rawItem = this.findItemById(type, itemId);
        if (rawItem == null) {
            return new Promise((resolve, reject) => { reject('invalid itemId ' + itemId); });
        }
        const rawItemName = rawItem.classname;
        const { itemName, colorId } = splitItemNameAndColor(rawItemName);

        if (this.bases[type][itemId] == null) {
            this.bases[type][itemId] = new Promise((resolve, reject) => {
                if (this.offsets[itemName] == null) {
                    this.offsets[itemName] = this._fetchOffsetAsync(itemName);
                }
                const offsetPromise = this.offsets[itemName];

                offsetPromise.then(offset => {
                    const visualization = offset.visualization;
                    let states: { [id: number]: State } = { "0": { count: 1 } };

                    const furniBase = new FurniBase(itemId, rawItem, offset);

                    if (visualization.animations != null) {
                        for (let stateIdStr in visualization.animations) {
                            const stateId = parseInt(stateIdStr);
                            let count = 1;
                            let loopCount = 1;
                            let frameRepeat = 1;
                            for (let animationLayer of visualization.animations[stateId].layers) {
                                //if(animationLayer.loopCount != null) loopCount = animationLayer.loopCount;
                                if(animationLayer.frameRepeat != null) frameRepeat = animationLayer.frameRepeat;
                                if(frameRepeat < 1)
                                    frameRepeat = 1;
                                
                                if (animationLayer.frameSequence != null) {
                                    for (let frameSequence of animationLayer.frameSequence) {
                                        if(frameSequence.random != null) {
                                            count = 1;
                                            break;
                                        }
                                        let loopCountTwo = 1;
                                        if(frameSequence.loopCount != null) loopCountTwo = frameSequence.loopCount;
                                        if(loopCountTwo < 1)
                                            loopCountTwo = 1;

                                        if (frameSequence.frame != null) {
                                            let frameLenght = ((frameSequence.frame.length * loopCountTwo) * frameRepeat) * loopCount;
                                            if (count < frameLenght) {
                                                count = frameLenght;
                                            }
                                        }
                                    }
                                }

                                states[stateId] = { count };

                                if (visualization.animations[stateId] != null) {
                                    const { transitionTo } = visualization.animations[stateId];
                                    if (transitionTo != null) {
                                        const allegedTransition = transitionTo;
                                        states[stateId].transitionTo = allegedTransition;
                                        states[allegedTransition].transition = stateId;
                                    }
                                }
                            }
                        }
                    }

                    const assetsPromises = [];

                    for (let assetId in offset.assets) {
                        const asset = offset.assets[assetId];
                        const fixedName = asset.name.split(itemName + '_')[1] as String;
                        if (fixedName.startsWith("64")) {
                            let resourceName = asset.name;
                            if (asset.source != null) {
                                resourceName = asset.source;
                            }
                            assetsPromises.push(downloadImageAsync("data:image/png;base64," + offset.images[resourceName]).then(img => {
                                furniBase.assets[asset.name] = new FurniAsset(img, asset.x, asset.y, asset.flipH != null && asset.flipH == true);
                            }).catch(err => {
                                reject(err);
                            }));
                        }
                    }

                    const color = (colorId == 0) ? "" : '_' + colorId;
                    assetsPromises.push(downloadImageAsync('http://bobba.io.test/hof_furni/icons/' + itemName + color + '_icon.png').then(img => {
                        furniBase.assets["icon"] = new FurniAsset(img, 0, 0, false);
                    }).catch(err => {
                        //reject(err);
                    }));

                    furniBase.states = states;

                    Promise.all(assetsPromises).then(() => {
                        resolve(furniBase);
                    }).catch(err => {
                        reject(err);
                    });

                }).catch(err => {
                    reject("Error downloading offset for " + itemName + " reason: " + err);
                });
            });
        }
        return this.bases[type][itemId];
    }

    async initialize(): Promise<void> {
        await this._loadFiles();
        this.ready = true;
    }

    async _loadFiles(): Promise<void> {
        this.furnidata = await this._fetchJsonAsync(LOCAL_RESOURCES_URL + "furnidata.json") as Furnidata;
    }

    _fetchJsonAsync(URL: string): Promise<object> {
        return new Promise((resolve, reject) => {

            const options: RequestInit = {
                method: 'GET',
                mode: 'cors',
                cache: 'default',
            };

            fetch(URL, options)
                .then(response => response.json())
                .then(data => resolve(data))
                .catch(err => reject(err));
        });
    }

    async _fetchOffsetAsync(uniqueName: string): Promise<FurniOffset> {
        return await this._fetchJsonAsync(LOCAL_RESOURCES_URL + 'furni/' + uniqueName + '.json') as FurniOffset;
    }
}

export enum ItemType { FloorItem = 'roomitem', WallItem = 'wallitem' }
export interface NameColorPair { itemName: string, colorId: number };
export type Direction = 0 | 2 | 4 | 6;
export type State = { count: number, transitionTo?: number, transition?: number, };

export const splitItemNameAndColor = (itemName: string): NameColorPair => {
    let colorId = 0;
    if (itemName.includes("*")) {
        const longFurniName = itemName.split("*");
        itemName = longFurniName[0];
        colorId = parseInt(longFurniName[1]);
    }
    return { itemName, colorId }
};