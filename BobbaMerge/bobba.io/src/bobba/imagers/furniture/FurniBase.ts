import { Direction, splitItemNameAndColor, State, LOCAL_RESOURCES_URL } from "./FurniImager";
import FurniAsset, { FurniAssetDictionary } from "./FurniAsset";
import { FurniDescription } from "./Furnidata";
import { FurniOffset } from "./FurniOffset";
import { flipImage, tintSprite } from "../misc/Util";

export default class FurniBase {
    itemId: number;
    itemData: FurniDescription;
    states: { [id: number]: State };
    assets: FurniAssetDictionary;
    offset: FurniOffset;

    constructor(itemId: number, itemData: FurniDescription, offset: FurniOffset) {
        this.itemId = itemId;
        this.itemData = itemData;
        this.states = {};
        this.assets = {};
        this.offset = offset;
    }

    getAvailableDirections(): Direction[] {
        const directions: Direction[] = [];
        const visualization = this.offset.visualization;
        const rawDirections = visualization.directions;
        for (let rawDirection in rawDirections) {
            directions.push(parseInt(rawDirection) as Direction);
        }
        return directions;
    }

    drawIcon(): HTMLCanvasElement {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');

        tempCanvas.width = 1;
        tempCanvas.height = 1;

        let icon = this.assets["icon"];
        if (tempCtx == null || icon == null)
            return tempCanvas;

        tempCanvas.width = icon.image.width;
        tempCanvas.height = icon.image.height;
        tempCtx.drawImage(icon.image, 0, 0);

        return tempCanvas;
    }

    draw(direction: Direction, state: number, frame: number): HTMLCanvasElement {
        const layers = this.getLayers(direction, state, frame);
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');

        tempCanvas.width = 1;
        tempCanvas.height = 1;

        if (tempCtx == null)
            return tempCanvas;

        let lefterX = 1000;
        let lefterFlippedX = 1000;
        let righterX = 0;
        let upperY = 1000;
        let lowerY = 0;
        for (let layer of layers) {
            let posX = -layer.asset.x;
            let posY = -layer.asset.y;
            let img: HTMLImageElement = layer.asset.image;

            if (layer.asset.isFlipped) {
                const flippedPosX = layer.asset.x - img.width;
                if (lefterFlippedX > flippedPosX) {
                    lefterFlippedX = flippedPosX;
                }
            }

            if (lefterX > posX) {
                lefterX = posX;
            }
            if (upperY > posY) {
                upperY = posY;
            }
            if (righterX < posX + img.width) {
                righterX = posX + img.width;
            }
            if (lowerY < posY + img.height) {
                lowerY = posY + img.height;
            }

            tempCanvas.width = righterX - lefterX;
            tempCanvas.height = lowerY - upperY;
        }

        for (let layer of layers) {
            let posX = -lefterX - layer.asset.x;
            let posY = -upperY - layer.asset.y;
            let img: HTMLImageElement | HTMLCanvasElement = layer.asset.image;

            if (layer.asset.isFlipped) {
                const flipped = flipImage(img);
                if (flipped != null) {
                    posX = layer.asset.x - img.width - lefterFlippedX;
                    img = flipped;
                }
            }

            if (layer.ink != null && layer.ink == 'ADD') {
                tempCtx.globalCompositeOperation = "lighter";
                continue;
            } else {
                tempCtx.globalCompositeOperation = "source-over";
            }

            if (layer.alpha != null) {
                const tinted = tintSprite(img, parseInt("0xffffff", 16), layer.alpha);
                if (tinted != null) img = tinted;
            }

            if (layer.color != null) {
                const tinted = tintSprite(img, layer.color, 255);
                if (tinted != null) img = tinted;
            }

            tempCtx.drawImage(img, posX, posY);
        }

        return tempCanvas;
    }

    getLayers(direction: Direction, state: number, frame: number): LayerData[] {
        const chunks: LayerData[] = [];
        const { itemName, colorId } = splitItemNameAndColor(this.itemData.classname);

        const visualization = this.offset.visualization;
        for (let i = -1; i < visualization.layerCount; i++) {
            let layerData: LayerData = {} as LayerData;
            layerData.id = i;
            layerData.frame = 0;
            layerData.resourceName = '';

            if (i == -1) {
                layerData.alpha = 77;
            }
            if (visualization.layers != null) {
                for (let layer of visualization.layers) {
                    if (layer.id == i) {
                        if (layer.x != null) layerData.x = layer.x;
                        if (layer.y != null) layerData.y = layer.y;
                        if (layer.z != null) layerData.z = layer.z;
                        if (layer.ink != null) layerData.ink = layer.ink;
                        if (layer.alpha != null) layerData.alpha = layer.alpha;
                        if (layer.ignoreMouse != null) layerData.ignoreMouse = layer.ignoreMouse == true;
                    }
                }
            }
            if (visualization.directions != null && visualization.directions[direction] != null) {
                for (let overrideLayer of visualization.directions[direction]) {
                    if (overrideLayer.id != i)
                        continue;
                    if (overrideLayer.x != null) layerData.x = overrideLayer.x;
                    if (overrideLayer.y != null) layerData.y = overrideLayer.y;
                    if (overrideLayer.z != null) layerData.z = overrideLayer.z;
                }
            }

            if (visualization.colors != null && visualization.colors[colorId] != null) {
                for (let colorLayer of visualization.colors[colorId]) {
                    if (colorLayer.id == i) {
                        layerData.color = parseInt(colorLayer.color, 16);
                    }
                }
            }

            if (visualization.animations != null && visualization.animations[state] != null) {
                for (let animationLayer of visualization.animations[state].layers) {
                    if (animationLayer.id == i && animationLayer.frameSequence != null) {
                        let tmpFrame = null;
                        for (let frameSequence of animationLayer.frameSequence) {
                            if (frameSequence.loopCount != null && frameSequence.loopCount == 1) {
                                if (frame <= frameSequence.frame.length)
                                    tmpFrame = frameSequence.frame[frame % frameSequence.frame.length];
                                else
                                    tmpFrame = frameSequence.frame[0];

                                break;
                            }
                            else if (frameSequence.random != null && frameSequence.random == 1) {
                                tmpFrame = frameSequence.frame[Math.floor(Math.random() * frameSequence.frame.length)];
                                break;
                            } else {
                                tmpFrame = frameSequence.frame[frame % frameSequence.frame.length];
                                break;
                            }
                        }
                        if (tmpFrame != null) {
                            if (tmpFrame.x != null) layerData.x = tmpFrame.x;
                            if (tmpFrame.y != null) layerData.y = tmpFrame.y;
                            if (tmpFrame.z != null) layerData.z = tmpFrame.z;
                            layerData.frame = tmpFrame.id;
                        }
                    }
                }
            }
            layerData.resourceName = buildResourceName(itemName, i, direction, layerData.frame);

            if (this.assets[layerData.resourceName] != null) {
                layerData.asset = this.assets[layerData.resourceName];
                chunks.push(layerData);
            }
        }

        return chunks;
    }
}

export interface LayerData {
    id: number,
    resourceName: string,
    asset: FurniAsset,
    frame: number,
    alpha?: number,
    color?: number,
    ink?: string,
    ignoreMouse?: boolean,
    x?: number,
    y?: number,
    z?: number,
};

const buildResourceName = (itemName: string, layerId: number, direction: Direction, frame: number): string => {
    return itemName + "_" + "64" + "_" + getLayerName(layerId) + "_" + direction + "_" + frame;
};

const getLayerName = (layerId: number): string => {
    if (layerId == -1) {
        return "sd";
    }
    return String.fromCharCode(97 + layerId);
};