export type Asset = {
    name: string
    x: string
    y: string
    usesPalette: string
    source: string
    flipH: string
}

export type Palette = {
    id: string
    source: string
    color1: string
    color2: string
    master: string
    tags: string
    breed: string
    colortag: string
}

export type Custompart = {
    id: string
    source: string
    tags: string
}

export type AssetsRootObject = {
    asset: Asset[]
    palette: Palette[]
    custompart: Custompart[]
}

export default AssetsRootObject

