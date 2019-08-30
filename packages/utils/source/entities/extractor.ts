import { injectable } from 'inversify'

import { readFromBufferP, Tag, Image, extractImages } from 'swf-extract'

import { parse, X2jOptions } from 'fast-xml-parser'

import { unpack } from 'qunpack'

import { IPetExtractor } from '../interfaces'

import { IndexRootObject, LogicRootObject, AssetsRootObject, VisualizationRootObject } from '../models'

export type SWFBinaryData = {
    index?: IndexRootObject
    logic?: LogicRootObject
    assets?: AssetsRootObject
    visualization?: VisualizationRootObject
}

export type SWFExtractedData = {
    images: Image[]
    symbols: string[]
    binaryData: SWFBinaryData
}

enum TagCodes {
    DEFINE_BINARY_DATA = 87,
    SYMBOL_CLASS = 76
}

@injectable()
export class PetExtractor implements IPetExtractor {
    async extractSWF(data: Buffer) {
        return readFromBufferP(data)
    }

    async extractImages(tags: Tag[]) {
        return Promise.all(extractImages(tags))
    }

    extractSymbolTags(tags: readonly Tag[]) {
        return tags.filter(this.isSymbolTagCode)
    }

    extractSymbols(tags: readonly Tag[], asset: string) {
        let symbols: string[] = []

        tags.map(tag => {
            const { rawData } = tag

            let rawBuffer = rawData.slice(2)

            while (rawBuffer.length > 0) {
                let data = unpack('vZ+1', rawBuffer)

                let characterId: number = data[0]
                let symbol: string = data[1]

                let regExp = new RegExp(`${asset}_${asset}_(32|64)`)
                let isValidSymbol = regExp.test(symbol)

                if (isValidSymbol) {
                    symbols[characterId] = symbol
                }

                rawBuffer = rawBuffer.slice(2 + symbol.length + 1)
            }
        })

        return symbols
    }

    extractBinaryDataTags(tags: readonly Tag[]) {
        return tags.filter(this.isBinaryDataTagCode)
    }

    extractBinaryData(tags: readonly Tag[]) {
        const data: SWFBinaryData = {} as const

        tags.map(tag => {
            const { rawData } = tag

            var xmlData = rawData.toString()

            const options: Partial<X2jOptions> = {
                attributeNamePrefix: '',
                ignoreAttributes: false,
                parseAttributeValue: true
            } as const

            var jsonData = parse(xmlData, options)

            const { assets, visualizationData, objectData, object } = jsonData

            if (assets) {
                Object.assign(data, {
                    assets: jsonData
                })
            }

            if (visualizationData) {
                Object.assign(data, {
                    visualization: jsonData
                })
            }

            if (objectData) {
                Object.assign(data, {
                    logic: jsonData
                })
            }

            if (object) {
                Object.assign(data, {
                    index: jsonData
                })
            }
        })

        return data
    }

    private isSymbolTagCode(tag: Tag) {
        return tag.code === TagCodes.SYMBOL_CLASS
    }

    private isBinaryDataTagCode(tag: Tag) {
        return tag.code === TagCodes.DEFINE_BINARY_DATA
    }
}