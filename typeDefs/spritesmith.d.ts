type Config = {
    src: string[],
    algorithm?: string,
    padding?: number,
    engine?: NodeRequire
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

type SpritesheetProperties = {
    width: number,
    height: number
}

declare module 'spritesmith' {
    export function run(config: Config, handleResult: (err: string, result: Result) => void): void
}