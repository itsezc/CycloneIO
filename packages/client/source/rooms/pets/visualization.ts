export type Layer = {
    id: string
    tag: string
}

type Layers = {
    layer: Layer[]
}

export type Layer2 = {
    id: string
    z: string
}

export type Direction = {
    layer: Layer2[]
    id: string
}

type Directions = {
    direction: Direction[]
}

export type Animation = {
    animationLayer: any
    id: string
}

type Animations = {
    animation: Animation[]
}

type Posture = {
    animationId: string
    id: string
}

type Postures = {
    posture: Posture[]
}

type Gesture = {
    animationId: string
    id: string
}

type Gestures = {
    gesture: Gesture[]
}

export type Visualization = {
    layers: Layers
    directions: Directions
    animations: Animations
    postures: Postures
    gestures: Gestures
    angle: string
    layerCount: string
    size: string
}

type Graphics = {
    visualization: Visualization[]
}

type VisualizationData = {
    graphics: Graphics
    type: string
}

type VisualizationRootObject =  {
    visualizationData: VisualizationData
}

export default VisualizationRootObject