type Asset = {
    name: string
    usesPalette: string
    x: string
    y: string
    source: string
    flipH: string
}

type Palette = {
    color1: string
    id: string
    source: string
}

type AssetsRootObject = {
    asset: Asset[]
    palette: Palette[]
}

export default AssetsRootObject

