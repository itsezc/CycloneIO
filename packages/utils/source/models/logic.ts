export type LogicRootObject = {
    objectData: ObjectData
}

type ObjectData = {
    type: string
    model: Model
    particlesystems: Particlesystems
}

type Model = {
    dimensions: Dimensions
    directions: Directions
}

type Dimensions = {
    x: string
    y: string
    z: string
}

type Directions = {
    direction: Direction[]
}

type Direction = {
    id: string
}

type Particlesystems = {
    particlesystem: Particlesystem[]
}

type Particlesystem = {
    size: string
}