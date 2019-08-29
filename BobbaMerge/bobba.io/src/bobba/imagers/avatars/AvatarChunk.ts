import { Direction } from "./AvatarInfo";

export default class AvatarChunk {
    lib: string;
    action: string;
    resAction: string;
    type: string;
    resType: string;
    isSmall: boolean;
    partId: number;
    direction: Direction;
    resDirection: number;
    resourceName: string;
    frame: number;
    resFrame: number;
    color: string | null;
    isFlip: boolean;
    promise: Promise<HTMLImageElement> | null;
    resource: HTMLImageElement | null;

    constructor(uniqueName: string, action: string, type: string, isSmall: boolean, partId: number, direction: Direction, frame: number, color: string) {
        this.resDirection = direction;
        this.lib = uniqueName;
        this.isFlip = false;
        this.action = action;
        this.resAction = action;
        this.type = type;
        this.resType = type;
        this.isSmall = isSmall;
        this.partId = partId;
        this.direction = direction;
        this.frame = frame;
        this.resFrame = frame;
        this.color = color;
        this.resourceName = this.getResourceName();
        this.promise = null;
        this.resource = null;
    }

    getResourceName(): string {
        let resourceName = "h";
        resourceName += "_";
        resourceName += this.resAction;
        resourceName += "_";
        resourceName += this.resType;
        resourceName += "_";
        resourceName += this.partId;
        resourceName += "_";
        resourceName += this.resDirection;
        resourceName += "_";
        resourceName += this.resFrame;
        return resourceName;
    }

    downloadAsync(imgData: string): Promise<HTMLImageElement> {
        if(imgData == undefined)
            imgData = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="; //1x1 empty pixel

        if (this.promise == null) {
            let img = new Image();
            this.promise = new Promise((resolve, reject) => {
                img.onload = () => {
                    this.resource = img;
                    resolve(img);
                };

                img.onerror = () => {
                    reject('Could not load image: ' + img.src);
                };
            });
            img.crossOrigin = "anonymous";
            img.src = "data:image/png;base64," + imgData;
        }
        return this.promise;
    }
}