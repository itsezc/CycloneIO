export type Asset = {
    name: string
    x: number
    y: number
    usesPalette: number
    source: string
    flipH?: number
}

export type Palette = {
    id: number
    source: string
    color1: any
    color2: any
    master: boolean
    tags: string
    breed?: number
    colortag?: number
}

export type Custompart = {
    id: number
    source: string
    tags: string
}

export type Assets = {
    asset: Asset[]
    palette: Palette[]
    custompart: Custompart[]
}

export type AssetsRootObject = {
    assets: Assets
}