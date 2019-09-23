import { injectable } from 'inversify'

import { IClothingGenerator } from '../interfaces'

import { Image } from 'swf-extract'

import { join } from 'path'
import { outputFile, outputJSON } from 'fs-extra'

import { ABSOLUTE_PATH } from '../extractor'

import { run, Result } from 'spritesmith'

import { Frames, Frame, Spritesheet } from '../models'

@injectable()
export class ClothingGenerator implements IClothingGenerator {
    async generateImages(data: { name: string, images: Image[], symbols: string[] }) {
        const { name, images, symbols } = data

        let paths: string[] = []
        let metaData: { code: number, characterId: number, imgName: string, imgType: string, }[] = []

        await Promise.all(images.map(async image => {
            const { code, characterId, imgType, imgData } = image

            let imgName = symbols[characterId]

            if (imgName) {
                const imgFileName = `${imgName}.${imgType}`
                const imgPath = join(ABSOLUTE_PATH, name, 'images', imgFileName)

                paths.push(imgPath)
                metaData.push({ code, characterId, imgName, imgType })

                await outputFile(imgPath, imgData)
            }
        }))

        return { paths, metaData }
    }

    async generateMetaData(metaData: { code: number, characterId: number, imgName: string, imgType: string, }[], name: string) {
        const path = join(ABSOLUTE_PATH, name, 'images', 'metadata.json')

        await outputJSON(path, metaData, {
            spaces: 4
        })
    }

    async generateSpritesheet(src: string[], name: string) {
        let promises: Promise<void>[][] = []

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

                const { x, y, width: w, height: h } = imgCoordinates

                const frame: Frame = {
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
                }

                frames[symbol] = frame
            })

            const { width: w, height: h } = properties

            const meta = {
                app: 'cyclone',
                version: '1.0',
                image: 'spritesheet',
                format: 'RGBA8888',
                size: {
                    w,
                    h
                },
                scale: '1'
            }

            const jsonSpritesheet: Spritesheet = {
                frames,
                meta
            }

            const imgSpritesheetPath = join(ABSOLUTE_PATH, name, `${name}.png`)
            const jsonSpritesheetPath = join(ABSOLUTE_PATH, name, `${name}.json`)

            let outFile = outputFile(imgSpritesheetPath, imgSpritesheet)
            let outJSON = outputJSON(jsonSpritesheetPath, jsonSpritesheet, {
                spaces: 4
            })

            promises.push([outFile, outJSON])

        })

        await Promise.all(promises.map(async outputFiles => {
            await Promise.all(outputFiles.map(async output => { await output }))
        }))
    }
}