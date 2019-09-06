export type FigureMap = {
    map: Map
}

type Map = {
    lib: Lib[]
}

type Lib = {
    id: string
    revision: string
    part: Part[]
}

type Part = {
    id: string
    type: string
}
