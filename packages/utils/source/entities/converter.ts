import { injectable } from 'inversify'

import { join } from 'path'

import { outputFile, outputJSON } from 'fs-extra'

import { Image } from 'swf-extract'

import { run, Result } from 'spritesmith'

import { IPetConverter } from '../interfaces'

import { ABSOLUTE_PATH } from '../entities'

import { Frame, Frames, Meta, JSONSpritesheet, MapRootObject } from '../models'

type ImageMetadata = {
    code: number,
    characterId: number,
    imgName: string,
    imgType: string,
}

@injectable()
export class PetConverter implements IPetConverter {
    private readonly metadata: ImageMetadata[]

    constructor() {
        this.metadata = []
    }

    async convertSWFImagesToPNG(images: readonly Image[], symbols: readonly string[], asset: string) {
        let filePaths: string[] = []

        await Promise.all(images.map(async image => {
            const { code, characterId, imgType, imgData } = image

            let imgName = symbols[characterId]

            if (imgName) {
                this.addMetadataChunk({ code, characterId, imgName, imgType })

                const imgFileName = `${imgName}.${imgType}`
                const imgPath = join(ABSOLUTE_PATH, asset, 'images', imgFileName)

                filePaths.push(imgPath)

                await outputFile(imgPath, imgData)
            }
        }))

        return filePaths
    }

    async generateMetadata(asset: string) {
        const path = join(ABSOLUTE_PATH, asset, 'images', 'metadata.json')

        await outputJSON(path, this.metadata, {
            spaces: 4
        })
    }

    convertPNGImagesToSpritesheet(src: string[], asset: string) {
        run({ src }, async (err: string, result: Result) => {
            if (err) {
                throw err
            }

            const { coordinates, properties, image: imgSpritesheet } = result

            let frames: Frames = {}

            src.map(source => {
                let imgCoordinates = coordinates[source]
                let splittedPath = source.split('\\')

                let fileName = splittedPath[splittedPath.length - 1]
                let symbol = fileName.split('.')[0]

                source = symbol

                const { x, y, width, height } = imgCoordinates

                const frame = this.getSpritesheetFrame(x, y, width, height)

                frames[source] = frame
            })

            const { width, height } = properties

            const meta = this.getSpritesheetMeta(width, height)

            const jsonSpritesheet: JSONSpritesheet = {
                frames,
                meta
            } as const

            const imgSpritesheetPath = join(ABSOLUTE_PATH, asset, `${asset}.png`)
            const jsonSpritesheetPath = join(ABSOLUTE_PATH, asset, `${asset}_spritesheet.json`)

            await outputFile(imgSpritesheetPath, imgSpritesheet)
            await outputJSON(jsonSpritesheetPath, jsonSpritesheet, {
                spaces: 4
            })

        })
    }

    async generateMap(asset: string, map: MapRootObject) {
        const path = join(ABSOLUTE_PATH, asset, `${asset}.json`)

        await outputJSON(path, map, {
            spaces: 4
        })
    }

    private addMetadataChunk(chunk: ImageMetadata) {
        this.metadata.push({ ...chunk })
    }

    private getSpritesheetFrame(x: number, y: number, w: number, h: number): Frame {
        return {
            frame: {
                x,
                y,
                w,
                h
            },
            rotated: false,
            trimmed: false,
            spriteSourceSize: {
                x: 0,
                y: 0,
                w,
                h,
            },
            sourceSize: {
                w,
                h
            }
        } as const
    }

    private getSpritesheetMeta(w: number, h: number): Meta {
        return {
            app: 'cyclone',
            version: '1.0',
            image: 'spritesheet',
            format: 'RGBA8888',
            size: {
                w,
                h
            },
            scale: '1'
        } as const
    }
}