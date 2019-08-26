import { readFromBufferP, extractImages, SWF, Tag, Image } from 'swf-extract'

import FileSystem, { existsSync } from 'fs'

import Path from 'path'

import Parser from 'fast-xml-parser'

import Spritesmith, { Result } from 'spritesmith'

import { unpack } from 'qunpack'

import { AssetsRootObject } from '../models/assets'
import { VisualizationRootObject } from '../models/visualization'
import { LogicRootObject } from '../models/logic'
import { IndexRootObject } from '../models/index'

import { ABSOLUTE_PATH } from './index'

type ImageMetadata = {
    code: number,
    characterId: number,
    imgName: string,
    imgType: string,
}

type BinaryData = {
    assets?: AssetsRootObject
    visualization?: VisualizationRootObject
    logic?: LogicRootObject
    index?: IndexRootObject
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
        this.imageSources = new Map<string, string[]>()
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

    public async extractBinaryData(tags: Tag[]): Promise<BinaryData> {

        return new Promise(resolve => {
            let binaryData: BinaryData = {}

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

                    const { assets, visualizationData, objectData, object } = jsonData

                    const stringifyJSON = JSON.stringify(jsonData, null, 2)

                    if (assets !== undefined) {
                        binaryData.assets = JSON.parse(stringifyJSON)
                    }

                    if (objectData !== undefined) {
                        binaryData.logic = JSON.parse(stringifyJSON)
                    }

                    if (object !== undefined) {
                        binaryData.index = JSON.parse(stringifyJSON)
                    }

                    if (visualizationData !== undefined) {
                        binaryData.visualization = JSON.parse(stringifyJSON)
                    }

                })

            resolve(binaryData)
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

            const jsonSpritesheetPath = Path.join(ABSOLUTE_PATH, pet, `${pet}_spritesheet.json`)
            const imageSpritesheetPath = Path.join(ABSOLUTE_PATH, pet, `${pet}.png`)

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

                let jsonSpritesheet: JSONSpritesheet = {
                    frames,
                    meta
                }

                var stringifyJSON = JSON.stringify(jsonSpritesheet, null, 2)

                if (!FileSystem.existsSync(jsonSpritesheetPath)) {
                    FileSystem.writeFileSync(jsonSpritesheetPath, stringifyJSON)
                    resolve(true)
                }

                if (!FileSystem.existsSync(imageSpritesheetPath)) {
                    FileSystem.writeFileSync(imageSpritesheetPath, image)
                    resolve(true)
                }

                resolve(false)
            })
        })
    }
}