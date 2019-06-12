export interface IData {
    type: string
    name: string
    visualizationType: string;
    logicType: string
    spritesheet: string
    dimensions: IDimension
    directions: number[]
    assets: { [key: string] : IAsset }
    visualization: IVisualization
}

export interface IDimension {
    x: number
    y: number
    z: number
}

export interface IAsset {
    source?: string
    x: number
    y: number
    flipH?: boolean
}

export interface IVisualization {
    layerCount: number
    angle: number
    layers?: { [key: string] : ILayer }
    colors?: { [key: string] : IColor }
    directions?: { [key: string] : IDirections }
    animations?: { [key: string] : IAnimation }
}

export interface ILayer {
    x?: number
    y?: number
    z?: number
    alpha?: number
    ink?: string
    ignoreMouse?: boolean
}

export interface IColor {
    layers: { [key: string] : IColorLayer }
}

export interface IColorLayer {
    color: number
}

export interface IDirections {
    layers: { [key: string] : ILayer }
}

export interface IAnimation {
    layers: { [key: string] : IAnimationLayer }
}

export interface IAnimationLayer {
    loopCount?: number
    frameRepeat?: number
    frames: number[]
}