import { Image } from 'swf-extract'

import { MapRootObject } from '../models'

export interface IPetConverter {
    convertSWFImagesToPNG(images: readonly Image[], symbols: readonly string[], asset: string): Promise<string[]>
    generateMetadata(asset: string): Promise<void>
    convertPNGImagesToSpritesheet(src: string[], asset: string): void
    generateMap(asset: string, map: MapRootObject): Promise<void>
}