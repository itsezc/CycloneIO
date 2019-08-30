export type MapRootObject = {
    type?: string
    name?: string
    visualizationType?: string
    logicType?: string
    spritesheet?: string
    dimentions?: Dimentions
    directions?: number[]
    assets?: MapAssets
    visualizations?: MapVisualization[]
}

type Dimentions = {
    x?: number
    y?: number
    z?: number
}

export type MapAssets = {
    [asset: string]: Asset
}

export type MapVisualization = {
    size?: MapVisualizationSize
    layerCount?: number
    angle?: number
    layers?: MapVisualizationLayers
    directions?: MapDirections
    animations?: MapAnimations
}

export type MapVisualizationSize = 32 | 64

export type MapVisualizationLayers = {
    [layer: number]: MapVisualizationLayer
}

type MapVisualizationLayer = {
    tag?: string
    alpha?: number
    ink?: string
    ignoreMouse?: boolean
    z?: number
}

type Asset = {
    source?: string
    x: number
    y: number
    flipH?: number
    usesPalette?: number
}

export type MapDirections = {
    [direction: number]: Direction
}

type Direction = {
    layers: MapDirectionLayers
}

export type MapDirectionLayers = {
    [layer: number]: DirectionLayer
}

type DirectionLayer = {
    z: number
}

export type MapAnimations = {
    [animation: number]: MapAnimationLayers
}

export type MapAnimationLayers = {
    [layer: number]: AnimationLayer
}

type AnimationLayer = {
    frames?: number[],
    loopCount?: number
    frameRepeat?: number
}