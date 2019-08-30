export type JSONSpritesheet = {
    frames: Frames,
    meta: Meta
}

export type Frames = {
    [frame: string]: Frame
}

export type Frame = {
    frame: Vector4,
    rotated: boolean,
    trimmed: boolean,
    spriteSourceSize: Vector4,
    sourceSize: Size
}

type Vector4 = {
    x: number,
    y: number,
    w: number,
    h: number
}

export type Meta = {
    app: string,
    version: string,
    image: string,
    format: string,
    size: Size,
    scale: string
}

type Size = {
    w: number,
    h: number
}