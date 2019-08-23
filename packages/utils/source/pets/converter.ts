import { readFromBufferP, extractImages, SWF, Tag, Image } from 'swf-extract'

import FileSystem, { existsSync } from 'fs'

import Path from 'path'

import Parser, { X2jOptions } from 'fast-xml-parser'

import Spritesmith, { Result } from 'spritesmith'

import { unpack } from 'qunpack'

import { ABSOLUTE_PATH } from './index'

type Metadata = {
    code: number,
    characterId: number,
    imgName: string,
    imgType: string,
}

enum TagType {
    DEFINE_BINARY_DATA = 87,
    SYMBOL_CLASS = 76
}

export default class PetConverter {
    private readonly metadata: Metadata[]
    private readonly imageResources: Map<string, string[]>

    public constructor() {
        this.metadata = []
        this.imageResources = new Map<string, string[]>() // <pet name, images paths>
    }

    public async extractSWF(rawData: Buffer): Promise<SWF> {
        return readFromBufferP(rawData)
    }

    public async extractImages(tags: Tag[]): Promise<Image[]> {
        return Promise.all(extractImages(tags))
    }

    public async extractSymbols(tags: Tag[], petType: string): Promise<string[]> {

        return new Promise(resolve => {
            let symbols: string[] = []

            tags.filter(tag => {
                return tag.code === TagType.SYMBOL_CLASS
            })
                .map(tag => {
                    const { rawData } = tag

                    let rawBuffer = rawData.slice(2)

                    while (rawBuffer.length > 0) {
                        let data = unpack('vZ+1', rawBuffer)

                        let characterId = data[0]
                        let symbol: string = data[1]

                        let regExp = new RegExp(`${petType}_${petType}_(32|64)`)
                        let isValidSymbol = regExp.test(symbol)

                        if (isValidSymbol) {
                            symbols[characterId] = symbol
                        }

                        rawBuffer = rawBuffer.slice(2 + symbol.length + 1)
                    }

                })

            resolve(symbols)
        })
    }

    public async writeBinaryData(tags: Tag[], petType: string): Promise<boolean> {

        return new Promise(resolve => {

            tags.filter(tag => {
                return tag.code === TagType.DEFINE_BINARY_DATA
            })
                .map(tag => {
                    const { rawData } = tag

                    let xmlData = rawData.toString()

                    const jsonData = Parser.parse(xmlData, {
                        attributeNamePrefix: '',
                        ignoreAttributes: false,
                        parseAttributeValue: true
                    })

                    const { assets, visualizationData, object } = jsonData

                    const stringifyJSON = JSON.stringify(jsonData, null, 2)

                    if (assets !== undefined) {
                        const path = Path.join(ABSOLUTE_PATH, petType, `${petType}_assets.json`)

                        if (!existsSync(path)) {
                            FileSystem.writeFileSync(path, stringifyJSON)
                            resolve(true)
                        }
                    }

                    if (visualizationData !== undefined) {
                        const path = Path.join(ABSOLUTE_PATH, petType, `${petType}_visualization.json`)

                        if (!existsSync(path)) {
                            FileSystem.writeFileSync(path, stringifyJSON)
                            resolve(true)
                        }
                    }

                    if (object !== undefined) {
                        const path = Path.join(ABSOLUTE_PATH, petType, `${petType}_logic.json`)

                        if (!existsSync(path)) {
                            FileSystem.writeFileSync(path, stringifyJSON)
                            resolve(true)
                        }
                    }

                })

            resolve(false)
        })
    }

    public async writeImages(petType: string, images: Image[], symbols: string[]): Promise<boolean> {

        return new Promise(resolve => {
            let hasNewData = false
            let imagePathNames: string[] = []

            const imagesPath = Path.join(ABSOLUTE_PATH, petType, 'images')

            if (!FileSystem.existsSync(imagesPath)) {
                FileSystem.mkdirSync(imagesPath)
            }

            images.map(image => {
                const { code, characterId, imgType, imgData } = image

                let imgName = symbols[characterId]

                if (imgName !== undefined) {
                    this.metadata.push({ code, characterId, imgName, imgType })

                    const imagePath = Path.join(imagesPath, `${imgName}.${imgType}`)

                    if (!FileSystem.existsSync(imagePath)) {
                        FileSystem.writeFileSync(imagePath, imgData)
                        hasNewData = true
                    }

                    imagePathNames.push(imagePath)
                }
            })

            if (hasNewData) {
                resolve(false)
            }

            this.imageResources.set(petType, imagePathNames)

            resolve(true)
        })
    }

    public async writeMetadata(petType: string): Promise<boolean> {

        return new Promise((resolve, reject) => {
            const imgsPath = Path.join(ABSOLUTE_PATH, petType, 'images')
            const metadataPath = Path.join(imgsPath, 'metadata.json')

            if (FileSystem.existsSync(metadataPath)) {
                resolve(true)
            }

            if (this.metadata === undefined) {
                reject(false)
            }

            FileSystem.writeFileSync(metadataPath, JSON.stringify(this.metadata, null, 2))

            resolve(false)
        })
    }

    public async generateSpritesheet(petType: string): Promise<boolean> {

        return new Promise((resolve, reject) => {

            let imageResources = this.imageResources.get(petType)

            const spritesheetImagePath = Path.join(ABSOLUTE_PATH, petType, `${petType}.png`)

            if (FileSystem.existsSync(spritesheetImagePath)) {
                resolve(false)
            }

            Spritesmith.run({ src: imageResources }, (err: string, result: Result) => {
                if (err) {
                    reject(err)
                }

                const { image } = result

                FileSystem.writeFileSync(spritesheetImagePath, image)

                resolve(true)
            })
        })
    }
}