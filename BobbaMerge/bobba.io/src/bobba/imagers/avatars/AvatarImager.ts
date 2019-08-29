import AvatarInfo, { Direction, FigurePart } from "./AvatarInfo";
import AvatarChunk from "./AvatarChunk";
import { resizeImage, flipImage, tintSprite } from "../misc/Util";
import { Draworder } from "./AvatarInterface";

export const LOCAL_RESOURCES_URL = "http://localhost/habbo-imaging/resource/";

export default class AvatarImager {
    ready: boolean;
    offsets: any;
    chunks: any;
    figuremap: any;
    figuredata: any;
    partsets: any;
    draworder: Draworder;
    animation: any;
    activeParts: any;

    constructor() {
        this.ready = false;
        this.offsets = {};
        this.chunks = {};
        this.figuremap = {};
        this.figuredata = {};
        this.partsets = {};
        this.draworder = {};
        this.animation = {};
        this.activeParts = {};
    }

    async initialize(): Promise<void> {
        const p = this.loadFiles();
        await Promise.all(p);
        this.ready = true;
    }

    loadActiveParts(): void {
        this.activeParts.rect = this.getActivePartSet("figure");
        this.activeParts.rectHeadOnly = this.getActivePartSet("head");
        this.activeParts.head = this.getActivePartSet("head");
        this.activeParts.eye = this.getActivePartSet("eye");
        this.activeParts.gesture = this.getActivePartSet("gesture");
        this.activeParts.speak = this.getActivePartSet("speak");
        this.activeParts.walk = this.getActivePartSet("walk");
        this.activeParts.sit = this.getActivePartSet("sit");
        this.activeParts.itemRight = this.getActivePartSet("itemRight");
        this.activeParts.handRight = this.getActivePartSet("handRight");
        this.activeParts.handLeft = this.getActivePartSet("handLeft");
        this.activeParts.swim = this.getActivePartSet("swim");
    }

    loadFiles(): Promise<void>[] {
        return [
            this.fetchJsonAsync(LOCAL_RESOURCES_URL + "map.json")
                .then(data => {
                    this.figuremap = data;
                }),
            this.fetchJsonAsync(LOCAL_RESOURCES_URL + "figuredata.json")
                .then(data => {
                    this.figuredata = data;
                }),
            this.fetchJsonAsync(LOCAL_RESOURCES_URL + "partsets.json")
                .then(data => {
                    this.partsets = data;
                    this.loadActiveParts();
                }),
            this.fetchJsonAsync(LOCAL_RESOURCES_URL + "draworder.json")
                .then(data => {
                    this.draworder = data as Draworder;
                }),
            this.fetchJsonAsync(LOCAL_RESOURCES_URL + "animation.json")
                .then(data => {
                    this.animation = data;
                })
        ];
    }

    fetchJsonAsync(URL: string): Promise<object> {
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

    async fetchOffsetAsync(uniqueName: string): Promise<void> {
        const data = await this.fetchJsonAsync(LOCAL_RESOURCES_URL + "/clothes/" + uniqueName + ".json");
        this.offsets[uniqueName] = data;
    }

    getTypeColorId(figure: string, part: string): number {
        const avatarInfo = new AvatarInfo(figure, 0, 0, ["std"], "std", 0, false, false, "s");
        let color = 0x000000;

        for (let figurePart of avatarInfo.figure) {
            if (figurePart.type === part) {
                const parts = this.getPartColor(figurePart);
                for (let type in parts) {
                    const part = parts[type];
                    for (let particle of part) {
                        if (particle.color != null) {
                            color = parseInt(particle.color, 16);
                            return color;
                        }
                    }
                }
            }
        }
        return color;
    }

    getChatColor(figure: string): number {
        return this.getTypeColorId(figure, 'ch');
    }

    generateGeneric(avatarInfo: AvatarInfo, isGhost: boolean): Promise<HTMLCanvasElement> {

        let drawParts = this.getDrawOrder(avatarInfo.drawOrder, avatarInfo.direction);
        if (drawParts == null) {
            drawParts = this.getDrawOrder("std", avatarInfo.direction);
        }

        const setParts: any = {};
        for (let partSet of avatarInfo.figure) {
            const parts = this.getPartColor(partSet);
            for (let type in parts) {
                if (setParts[type] == null) {
                    setParts[type] = [];
                }
                setParts[type] = parts[type].concat(setParts[type]);
            }
        }

        if (avatarInfo.handItem > 0) {
            setParts["ri"] = [{ "index": 0, "id": avatarInfo.handItem }];
        }

        const chunks: AvatarChunk[] = [];
        const offsetsPromises: Promise<void>[] = [];

        for (let type of drawParts) {
            const drawableParts = setParts[type];
            if (drawableParts == null)
                continue;
            for (let drawablePart of drawableParts) {
                const uniqueName = this.getPartUniqueName(type, drawablePart["id"]);
                if (uniqueName == null)
                    continue;

                if (setParts["hidden"].includes(type)) {
                    continue;
                }

                if (this.activeParts.head.includes(type) && avatarInfo.isBodyOnly) {
                    continue;
                }

                if ((!this.activeParts.rect.includes(type) && !avatarInfo.isHeadOnly) || (!this.activeParts.rectHeadOnly.includes(type) && avatarInfo.isHeadOnly)) {
                    continue;
                }

                if (isGhost && (this.activeParts.gesture.includes(type) || this.activeParts.eye.includes(type))) {
                    continue;
                }

                let drawDirection = avatarInfo.direction;
                let drawAction = null;

                if ((this.activeParts.rect.includes(type) && !avatarInfo.isHeadOnly) || (this.activeParts.rectHeadOnly.includes(type) && avatarInfo.isHeadOnly)) {
                    drawAction = avatarInfo.drawAction['body'];
                }
                if (this.activeParts.head.includes(type)) {
                    drawDirection = avatarInfo.headDirection;
                }
                if (this.activeParts.speak.includes(type) && avatarInfo.drawAction['speak']) {
                    drawAction = avatarInfo.drawAction['speak'];
                }
                if (this.activeParts.gesture.includes(type) && avatarInfo.drawAction['gesture']) {
                    drawAction = avatarInfo.drawAction['gesture'];
                }
                if (this.activeParts.eye.includes(type)) {
                    drawablePart.colorable = false;
                    if (avatarInfo.drawAction['eye']) {
                        drawAction = avatarInfo.drawAction['eye'];
                    }
                }
                if (this.activeParts.walk.includes(type) && avatarInfo.drawAction['wlk']) {
                    drawAction = avatarInfo.drawAction['wlk'];
                }
                if (this.activeParts.sit.includes(type) && avatarInfo.drawAction['sit']) {
                    drawAction = avatarInfo.drawAction['sit'];
                }
                if (this.activeParts.handRight.includes(type) && avatarInfo.drawAction['handRight']) {
                    drawAction = avatarInfo.drawAction['handRight'];
                }
                if (this.activeParts.itemRight.includes(type) && avatarInfo.drawAction['itemRight']) {
                    drawAction = avatarInfo.drawAction['itemRight'];
                }
                if (this.activeParts.handLeft.includes(type) && avatarInfo.drawAction['handLeft']) {
                    drawAction = avatarInfo.drawAction['handLeft'];
                }
                if (this.activeParts.swim.includes(type) && avatarInfo.drawAction['swm']) {
                    drawAction = avatarInfo.drawAction['swm'];
                }

                if (drawAction == null) {
                    continue;
                }

                if (this.offsets[uniqueName] == null) {
                    this.offsets[uniqueName] = { 'promise': this.fetchOffsetAsync(uniqueName), 'data': {} };
                }
                offsetsPromises.push(this.offsets[uniqueName].promise);

                const color = drawablePart.colorable ? drawablePart.color : null;
                const drawPartChunk = this.getPartResource(uniqueName, drawAction, type, avatarInfo.isSmall, drawablePart["id"], drawDirection, avatarInfo.frame, color);
                chunks.push(drawPartChunk);
            }
        }

        return new Promise((resolve, reject) => {

            Promise.all(offsetsPromises).then(() => {
                let tempCanvas: HTMLCanvasElement = document.createElement('canvas');
                let tempCtx = tempCanvas.getContext('2d');
                tempCanvas.width = avatarInfo.rectWidth;
                tempCanvas.height = avatarInfo.rectHeight;

                const chunksPromises = [];

                for (let chunk of chunks) {
                    if (this.offsets[chunk.lib].offsets != null && this.offsets[chunk.lib].offsets[chunk.getResourceName()] != null && !this.offsets[chunk.lib].offsets[chunk.getResourceName()].flipped) {
                        chunksPromises.push(chunk.downloadAsync(this.offsets[chunk.lib].images[chunk.getResourceName()]));
                    } else {
                        let flippedType = this.partsets.partSet[chunk.type]['flipped-set-type'];
                        if (flippedType !== "") {
                            chunk.resType = flippedType;
                        }
                        if (chunk.action === "std" && (this.offsets[chunk.lib].offsets == null || this.offsets[chunk.lib].offsets[chunk.getResourceName()] == null || this.offsets[chunk.lib].offsets[chunk.getResourceName()].flipped)) {
                            chunk.resAction = "spk";
                        }
                        if (this.offsets[chunk.lib].offsets == null || this.offsets[chunk.lib].offsets[chunk.getResourceName()] == null || this.offsets[chunk.lib].offsets[chunk.getResourceName()].flipped) {
                            chunk.isFlip = true;
                            chunk.resAction = chunk.action;

                            chunk.resDirection = 6 - chunk.direction;
                        }
                        if (this.offsets[chunk.lib].offsets == null || this.offsets[chunk.lib].offsets[chunk.getResourceName()] == null || this.offsets[chunk.lib].offsets[chunk.getResourceName()].flipped) {
                            chunk.resFrame = chunk.frame + 1;
                            chunk.isFlip = false;
                        }
                        if (this.offsets[chunk.lib].offsets == null || this.offsets[chunk.lib].offsets[chunk.getResourceName()] == null || this.offsets[chunk.lib].offsets[chunk.getResourceName()].flipped) {
                            chunk.isFlip = false;
                            chunk.resFrame = chunk.frame;
                            chunk.resAction = chunk.action;
                            if (chunk.direction === 7) {
                                chunk.resDirection = 3;
                            }
                            if (chunk.direction === 3) {
                                chunk.resDirection = 7;
                            }
                        }
                        if (this.offsets[chunk.lib].offsets == null || this.offsets[chunk.lib].offsets[chunk.getResourceName()] == null || this.offsets[chunk.lib].offsets[chunk.getResourceName()].flipped) {
                            chunk.resFrame = chunk.frame + 1;
                            chunk.isFlip = false;
                        }
                        if (this.offsets[chunk.lib].offsets == null || this.offsets[chunk.lib].offsets[chunk.getResourceName()] == null || this.offsets[chunk.lib].offsets[chunk.getResourceName()].flipped) {
                            chunk.resAction = chunk.action;
                            chunk.resType = flippedType;
                            chunk.resDirection = chunk.direction;
                        }
                        if (chunk.action === "std" && (this.offsets[chunk.lib].offsets == null || this.offsets[chunk.lib].offsets[chunk.getResourceName()] == null || this.offsets[chunk.lib].offsets[chunk.getResourceName()].flipped)) { //////// ?????? CHECK THIS
                            chunk.resAction = "spk";
                            chunk.resType = chunk.type;
                        }
                        if (this.offsets[chunk.lib].offsets != null && this.offsets[chunk.lib].offsets[chunk.getResourceName()] != null && !this.offsets[chunk.lib].offsets[chunk.getResourceName()].flipped) {
                            chunksPromises.push(chunk.downloadAsync(this.offsets[chunk.lib].images[chunk.getResourceName()]));
                        }
                    }
                }

                Promise.all(chunksPromises).catch(err => {
                    reject("Error downloading chunks");
                }).then(() => {
                    for (let chunk of chunks) {
                        if (this.offsets[chunk.lib].offsets != null && this.offsets[chunk.lib].offsets[chunk.getResourceName()] != null) {
                            if (chunk.resource != null) {
                                let posX = -this.offsets[chunk.lib].offsets[chunk.getResourceName()].x;
                                let posY = (avatarInfo.rectHeight / 2) - this.offsets[chunk.lib].offsets[chunk.getResourceName()].y + avatarInfo.rectHeight / 2.5;

                                let img: any = chunk.resource;
                                if (chunk.color != null) {
                                    img = tintSprite(img, parseInt(chunk.color, 16), (isGhost ? 170 : 255));
                                }
                                if (chunk.isFlip) {
                                    posX = -(posX + img.width - avatarInfo.rectWidth + 1);
                                    img = flipImage(img);
                                }
                                if (tempCtx != null) {
                                    tempCtx.drawImage(img, posX, posY);
                                }
                            }
                        }
                    }

                    /*if(avatarInfo.isHeadOnly) {
                        avatarInfo.rectWidth = 54;
                        avatarInfo.rectHeight = 62;
                        tempCanvas = this.resizeCanvas(tempCanvas, avatarInfo);
                    }*/

                    if (avatarInfo.isSmall) {
                        tempCanvas = resizeImage(tempCanvas, 0.5);
                    }
                    if (avatarInfo.isLarge) {
                        tempCanvas = resizeImage(tempCanvas, 2);
                    }

                    resolve(tempCanvas);
                });
            });
        });
    }

    getActivePartSet(partSet: string): any {
        const activeParts = this.partsets['activePartSet'][partSet]['activePart'];
        if (activeParts == null || activeParts.length === 0) {
            return null;
        }
        return activeParts;
    }

    getDrawOrder(action: string, direction: Direction): any {
        const drawOrder = this.draworder[action][direction];
        if (drawOrder == null || drawOrder.length === 0) {
            return null;
        }
        return drawOrder;
    }

    getPartPalette(partType: string): any {
        let partSet = this.figuredata['settype'][partType];
        if (partSet != null) {
            const paletteId = partSet['paletteid'];
            return this.figuredata['palette'][paletteId];
        }
        return null;
    }

    getPartPaletteCount(partType: string, partId: string): number {
        const partSet = this.getPartSet(partType);
        if (partSet != null) {
            const selectedPart = partSet[partId];
            if (selectedPart != null) {
                const chunks = selectedPart.part as any[];
                const maxColors = Math.max.apply(Math, chunks.map(o => o.colorindex));
                return Math.max(1, maxColors);
            }
        }
        return 1;
    }

    getPartSet(partType: string): any {
        let partSet = this.figuredata['settype'][partType];
        if (partSet != null) {
            return partSet.set;
        }
        return null;
    }

    getPartColor(figure: FigurePart): any {
        const parts: any = {};
        let partSet = this.figuredata['settype'][figure.type];
        if (partSet != null) {
            if (partSet['set'][figure.id] != null && partSet['set'][figure.id]['part'] != null) {
                for (let rawPart of partSet['set'][figure.id]['part']) {
                    const part: any = rawPart;

                    let element: any = { "index": part.index, "id": part.id, "colorable": part.colorable };
                    if (part.colorable) {
                        element.color = this.getColorByPaletteId(partSet.paletteid, figure.colors[part.colorindex - 1]);
                    }
                    if (parts[part.type] == null) {
                        parts[part.type] = [element];
                    } else {
                        parts[part.type].push(element);
                    }
                }
            }
            //r63 ?

            parts.hidden = [];
            if (partSet['set'][figure.id] != null && Array.isArray(partSet['set'][figure.id]['hidden'])) {
                for (let partType of partSet['set'][figure.id]['hidden']) {
                    parts.hidden.push(partType);
                }
            }
        }
        return parts;
    }

    getColorByPaletteId(paletteId: string, colorId: string): any {
        if (this.figuredata['palette'][paletteId] != null && this.figuredata['palette'][paletteId][colorId] != null && this.figuredata['palette'][paletteId][colorId]['color'] != null) {
            return this.figuredata['palette'][paletteId][colorId]['color'];
        }
        return null;
    }

    getPartUniqueName(type: string, partId: number): string {
        let uniqueName = this.figuremap[type][partId];
        if (uniqueName == null && type === "hrb") {
            uniqueName = this.figuremap["hr"][partId];
        }
        if (uniqueName == null) {
            uniqueName = this.figuremap[type][1];
        }
        if (uniqueName == null) {
            uniqueName = this.figuremap[type][0];
        }
        return uniqueName;
    }

    getPartResource(uniqueName: string, action: string, type: string, isSmall: boolean, partId: number, direction: Direction, frame: number, color: string) {
        let partFrame = this.getFrameNumber(type, action, frame);
        let chunk = new AvatarChunk(uniqueName, action, type, isSmall, partId, direction, partFrame, color);
        let resourceName = chunk.getResourceName();
        if (this.chunks[resourceName] != null && this.chunks[resourceName].resource != null) {
            chunk.resource = this.chunks[resourceName].resource;
            chunk.promise = this.chunks[resourceName].promise;
        } else {
            this.chunks[resourceName] = chunk;
        }
        return chunk;
    }

    getFrameNumber(type: string, action: string, frame: number) {
        const translations: any = { "wav": "Wave", "wlk": "Move", "spk": "Talk" };
        if (translations[action] != null) {
            if (this.animation[translations[action]].part[type] != null) {
                const count = this.animation[translations[action]].part[type].length;
                if (this.animation[translations[action]].part[type][frame % count] != null) {
                    return this.animation[translations[action]].part[type][frame % count].number;
                }
            }
        }
        return 0;
    }
}