export type MapRootObject = {
    type?: string
    name?: string
    visualizationType?: string
    logicType?: string
    spritesheet?: string
    dimentions?: Dimentions
    directions?: number[]
    assets?: Assets
    visualizations?: MapVisualization[]
}

export type Dimentions = {
    x?: number
    y?: number
    z?: number
}

export type Assets = {
    [asset: string]: Asset
}

export type MapVisualization = {
    size?: VisualizationSize
    layerCount?: number
    angle?: number
    layers?: VisualizationLayers
    directions?: Directions
    animations?: Animations
}

export type VisualizationSize = 32 | 64

export type VisualizationLayers = {
    [layer: number]: VisualizationLayer
}

export type VisualizationLayer = {
    tag?: string
    alpha?: number
    ink?: string
    ignoreMouse?: boolean
    z?: number
}

export type Asset = {
    source?: string
    x: number
    y: number
    flipH?: number
    usesPalette?: number
}

export type Directions = {
    [direction: number]: Direction
}

export type Direction = {
    layers: DirectionLayers
}

export type DirectionLayers = {
    [layer: number]: DirectionLayer
}

export type DirectionLayer = {
    z: number
}

export type Animations = {
    [animation: number]: AnimationLayers
}

export type AnimationLayers = {
    [layer: number]: AnimationLayer
}

export type AnimationLayer = {
    frames?: number[],
    loopCount?: number
    frameRepeat?: number
}