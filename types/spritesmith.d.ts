type Config = {
    src: string[]
}

export type Result = {
    coordinates: Coords
    properties: ImageProperties,
    image: Buffer
}

type Coords = {
    [path: string]: ImageProperties
}

type ImageProperties = {
    x: number,
    y: number,
    width: number,
    height: number
}

type Properties = {
    width: number,
    height: number
}

export type Img = {
    data: Uint8Array[]
    shape: number[],
    stride: number[],
    offset: number
    width: number,
    height: number,
    filepath: string
}

declare module 'spritesmith' {
    export function run(config: Config, handleResult: (err: string, result: Result) => void): void

    export default class Spritesmith {
        public constructor()
        public createImages(src: string[], handleImages: (err: string, images: Img[]) => void): void
    }
}