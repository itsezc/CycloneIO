export type Layer = {
    id: string
    tag?: string
    alpha: number,
    ink?: string
    ignoreMouse?: boolean
    z?: number
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

export type Frame = {
    id: string
}

export type FrameSequence = {
    frame: Frame[] | Frame
}

export type AnimationLayer = {
    frameRepeat?: number
    id: string
    loopCount?: number
    frameSequence: FrameSequence
}

export type Animation = {
    animationLayer: AnimationLayer[]
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

export type VisualizationRootObject =  {
    visualizationData: VisualizationData
}