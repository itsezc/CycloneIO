export type VisualizationRootObject =  {
    visualizationData: VisualizationData
}

type VisualizationData = {
    graphics: Graphics
    type: string
}

type Graphics = {
    visualization: Visualization[]
}

export type Visualization = {
    layers: Layers
    directions: VisualizationDirections
    animations: Animations
    postures: Postures
    gestures: Gestures
    angle: string
    layerCount: string
    size: string
}

type Layers = {
    layer: Layer[]
}

type Layer = {
    id: string
    tag?: string
    alpha: number,
    ink?: string
    ignoreMouse?: boolean
    z?: number
}

type VisualizationDirections = {
    direction: VisualizationDirection[]
}

export type VisualizationDirection = {
    layer: Layer2[]
    id: string
}

type Layer2 = {
    id: string
    z: string
}

type Animations = {
    animation: VisualizationAnimation[]
}

export type VisualizationAnimation = {
    animationLayer: AnimationLayer[]
    id: string
}

type AnimationLayer = {
    frameRepeat?: number
    id: string
    loopCount?: number
    frameSequence: VisualizationFrameSequence
}

export type VisualizationFrameSequence = {
    frame: VisualizationFrame[] | VisualizationFrame
}

export type VisualizationFrame = {
    id: string
}

type Postures = {
    posture: Posture[]
}

type Posture = {
    animationId: string
    id: string
}

type Gestures = {
    gesture: Gesture[]
}

type Gesture = {
    animationId: string
    id: string
}