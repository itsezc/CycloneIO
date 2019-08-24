import { readFromBufferP, extractImages, SWF, Tag, Image } from 'swf-extract'

import FileSystem, { existsSync } from 'fs'

import Path from 'path'

import Parser from 'fast-xml-parser'

import Spritesmith, { Result } from 'spritesmith'

import { unpack } from 'qunpack'

import { ABSOLUTE_PATH } from './index'

type ImageMetadata = {
    code: number,
    characterId: number,
    imgName: string,
    imgType: string,
}

type JSONSpritesheet = {
    frames: Frames,
    meta: SpritesheetMeta
}

type Frames = {
    [frame: string]: Frame
}

type Frame = {
    frame: Vector4,
    rotated: boolean,
    trimmed: boolean,
    spriteSourceSize: Vector4,
    sourceSize: Size
}

type Vector4 = {
    x: number,
    y: number,
    w: number,
    h: number
}

type SpritesheetMeta = {
    app: string,
    version: string,
    image: string,
    format: string,
    size: Size,
    scale: string
}

type Size = {
    w: number,
    h: number
}

enum TagCodes {
    DEFINE_BINARY_DATA = 87,
    SYMBOL_CLASS = 76
}

export default class PetConverter {
    private readonly metadata: ImageMetadata[]
    private readonly imageSources: Map<string, string[]>

    public constructor() {
        this.metadata = []
        this.imageSources = new Map()
    }

    public async extractSWF(rawData: Buffer): Promise<SWF> {
        return readFromBufferP(rawData)
    }

    public async extractImages(tags: Tag[]): Promise<Image[]> {
        return Promise.all(extractImages(tags))
    }

    public async extractSymbols(tags: Tag[], pet: string): Promise<string[]> {

        return new Promise(resolve => {
            let symbols: string[] = []

            tags.filter(tag => {
                return tag.code === TagCodes.SYMBOL_CLASS
            })
                .map(tag => {
                    const { rawData } = tag

                    let rawBuffer = rawData.slice(2)

                    while (rawBuffer.length > 0) {
                        let data = unpack('vZ+1', rawBuffer)

                        let characterId = data[0]
                        let symbol: string = data[1]

                        let regExp = new RegExp(`${pet}_${pet}_(32|64)`)
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

    public async writeBinaryData(tags: Tag[], pet: string): Promise<boolean> {

        return new Promise(resolve => {

            tags.filter(tag => {
                return tag.code === TagCodes.DEFINE_BINARY_DATA
            })
                .map(tag => {
                    const { rawData } = tag

                    let xmlData = rawData.toString()

                    const jsonData = Parser.parse(xmlData, {
                        attributeNamePrefix: '',
                        ignoreAttributes: false,
                        parseAttributeValue: true
                    })

                    const { assets, visualizationData, objectData } = jsonData

                    const stringifyJSON = JSON.stringify(jsonData, null, 2)

                    if (assets !== undefined) {
                        const path = Path.join(ABSOLUTE_PATH, pet, `${pet}_assets.json`)

                        if (!existsSync(path)) {
                            FileSystem.writeFileSync(path, stringifyJSON)
                            resolve(true)
                        }
                    }

                    if (visualizationData !== undefined) {
                        const path = Path.join(ABSOLUTE_PATH, pet, `${pet}_visualization.json`)

                        if (!existsSync(path)) {
                            FileSystem.writeFileSync(path, stringifyJSON)
                            resolve(true)
                        }
                    }

                    if (objectData !== undefined) {
                        const path = Path.join(ABSOLUTE_PATH, pet, `${pet}_logic.json`)

                        if (!existsSync(path)) {
                            FileSystem.writeFileSync(path, stringifyJSON)
                            resolve(true)
                        }
                    }

                })

            resolve(false)
        })
    }

    public async writeImages(images: Image[], symbols: string[], pet: string): Promise<boolean> {

        return new Promise(resolve => {

            let imageFilePaths: string[] = []

            const imagesPath = Path.join(ABSOLUTE_PATH, pet, 'images')

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
                        resolve(false)
                    }

                    imageFilePaths.push(imagePath)
                }
            })

            this.imageSources.set(pet, imageFilePaths)

            resolve(true)
        })
    }

    public async writeMetadata(pet: string): Promise<boolean> {

        return new Promise((resolve, reject) => {

            const imagesPath = Path.join(ABSOLUTE_PATH, pet, 'images')
            const metadataPath = Path.join(imagesPath, 'metadata.json')

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

    public async generateSpritesheet(pet: string): Promise<boolean> {

        return new Promise((resolve, reject) => {

            let imageSources = this.imageSources.get(pet)

            const spritesheetJSONPath = Path.join(ABSOLUTE_PATH, pet, `${pet}_spritesheet.json`)
            const spritesheetImagePath = Path.join(ABSOLUTE_PATH, pet, `${pet}.png`)

            let frames: Frames = {}

            Spritesmith.run({ src: imageSources }, (err: string, result: Result) => {
                if (err) {
                    reject(err)
                }

                const { coordinates, properties, image } = result

                imageSources.map(source => {
                    let coords = coordinates[source]
                    let pieces = source.split('\\')

                    let name = pieces[pieces.length - 1]
                    let symbol = name.split('.')[0]

                    source = symbol

                    const { x, y, width, height } = coords

                    let frame: Frame = {
                        frame: {
                            x,
                            y,
                            w: width,
                            h: height
                        },
                        rotated: false,
                        trimmed: false,
                        spriteSourceSize: {
                            x: 0,
                            y: 0,
                            w: width,
                            h: height
                        },
                        sourceSize: {
                            w: width,
                            h: height
                        }
                    }

                    frames[source] = frame
                })

                const { width, height } = properties

                let meta: SpritesheetMeta = {
                    app: 'cyclone',
                    version: '1.0',
                    image: 'spritesheet',
                    format: 'RGBA8888',
                    size: {
                        w: width,
                        h: height
                    },
                    scale: '1'
                }

                let JSONSpritesheet: JSONSpritesheet = {
                    frames,
                    meta
                }

                var stringifyJSON = JSON.stringify(JSONSpritesheet, null, 2)

                if (!FileSystem.existsSync(spritesheetJSONPath)) {
                    FileSystem.writeFileSync(spritesheetJSONPath, stringifyJSON)
                    resolve(true)
                }

                if (!FileSystem.existsSync(spritesheetImagePath)) {
                    FileSystem.writeFileSync(spritesheetImagePath, image)
                    resolve(true)
                }

                resolve(false)
            })
        })
    }
}