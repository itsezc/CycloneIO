export type Dimensions = {
    x: string
    y: string
    z: string
}

export type Direction = {
    id: string
}

export type Directions = {
    direction: Direction[]
}

export type Model = {
    dimensions: Dimensions
    directions: Directions
}

export type Particlesystem = {
    size: string
}

export type Particlesystems = {
    particlesystem: Particlesystem[]
}

export type ObjectData = {
    type: string
    model: Model
    particlesystems: Particlesystems
}

type LogicRootObject = {
    objectData: ObjectData
}

export default LogicRootObject