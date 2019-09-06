import { injectable } from 'inversify'

import { IClothingParser } from '../interfaces'

import { FigureMap } from '../models'

import Download from 'download'

import Logger from '../logging/logger'

import { magenta, green } from 'cli-color'

import { parse } from 'fast-xml-parser'

import { join } from 'path'

import { pathExists } from 'fs-extra'

import { flashImagesURL, PRODUCTION } from '../../config.json'

import { ABSOLUTE_PATH } from '../extractor'

import { unpack } from 'qunpack'

@injectable()
export class ClothingParser implements IClothingParser {
    async parseFigureMap(figureMap: string) {
        const swfs: { name: string, rawData: Buffer }[] = []
        const json: FigureMap = parse(figureMap, { attributeNamePrefix: '', ignoreAttributes: false, parseAttributeValue: true })

        const { map } = json
        const { lib: clothing } = map

        await Promise.all(clothing.map(async clothing => {
            const { id: name } = clothing
            const pathName = join(ABSOLUTE_PATH, name)

            const exists = await pathExists(pathName)

            if (!exists) {
                Logger.info(`${magenta('[DOWNLOADING]')} ${name}`)

                const url = `${flashImagesURL}/gordon/${PRODUCTION}/${name}.swf`
                const rawData = await Download(url)

                Logger.info(`${magenta('[DOWNLOADING]')}${green('[DONE]')} ${name}`)

                swfs.push({ name, rawData })
            }
        }))

        return swfs
    }

    parseRawBuffer(rawData: Buffer, symbols: string[]) {
        let rawBuffer = rawData.slice(2)

        while (rawBuffer.length > 0) {
            let data = unpack('vZ+1', rawBuffer)

            const characterId: number = data[0]
            const symbol: string = data[1]

            if (characterId !== 0 && !symbol.endsWith('manifest')) {
                symbols[characterId] = symbol
            }

            rawBuffer = rawBuffer.slice(2 + symbol.length + 1)
        }
    }
}