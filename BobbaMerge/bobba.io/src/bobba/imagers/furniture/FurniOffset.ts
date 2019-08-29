export interface FurniOffset {
    type: string,
    visualization: Visualization,
    logic: Logic
    assets: Asset[],
    images: string[]
}

interface Visualization {
    type: string,
    layerCount: number,
    angle: number,
    layers: Layer[]
    directions: { [id: number]: Layer[] },
    colors: { [id: number]: Color[] },
    animations: Animation[]
}

interface Animation {
    id: number,
    transitionTo?: number,
    transitionFrom?: number,
    immediateChangeFrom?: number,
    layers: AnimationLayer[]
}

interface AnimationLayer {
    id: number,
    frameRepeat?: number,
    random?: number,
    loopCount?: number,
    frameSequence: FrameSequence[]
}

interface FrameSequence {
    frame: Frame[],
    loopCount?: number,
    random?: number
}

interface Frame {
    id: number,
    x?: number,
    y?: number,
    randomX?: number,
    randomY?: number
}

interface Color {
    id: number,
    color: string
}

interface Layer {
    id: number,
    ink?: string,
    tag?: string,
    alpha?: number,
    ignoreMouse?: boolean,
    x?: number,
    y?: number,
    z?: number
}

interface Asset {
    name: string,
    x: number,
    y: number,
    source?: string,
    flipH?: boolean,
}

interface Logic {
    type: string,
    dimensions: { x: number, y: number, z: number },
    directions: number[]
}