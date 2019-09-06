import { Image } from 'swf-extract'

export interface IClothingGenerator {
    generateImages(data:
        { name: string, images: Image[], symbols: string[] }): Promise<{
            paths: string[],
            metaData: { code: number, characterId: number, imgName: string, imgType: string, }[]
        }>
    generateMetaData(metaData: { code: number, characterId: number, imgName: string, imgType: string, }[], name: string): Promise<void>
    generateSpritesheet(paths: string[], name: string): void
}