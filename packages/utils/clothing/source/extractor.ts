import { injectable, inject } from 'inversify'

import { IClothingParser, IClothingGenerator } from './interfaces'
import { ClothingParser, ClothingGenerator } from './entities'

import Logger from './logging/logger'

import { magenta, green, cyan, blueBright, red, yellow, cyanBright, magentaBright, bgBlue, yellowBright } from 'cli-color'

import { flashImagesURL, PRODUCTION } from '../config.json'

import { readFromBufferP, extractImages, Tag, Image } from 'swf-extract'

import Download from 'download'

import { join } from 'path'

export const ABSOLUTE_PATH = join(__dirname, '..', '..', '..', '..', 'web-gallery', 'clothing')

@injectable()
export default class ClothingExtractor {
    @inject(ClothingParser) private readonly parser: IClothingParser
    @inject(ClothingGenerator) private readonly generator: IClothingGenerator

    async init() {
        Logger.info(`${magenta('[DOWNLOADING]')} Figure Map`)

        const url = `${flashImagesURL}/gordon/${PRODUCTION}/figuremap.xml`
        const figureMap = await Download(url, undefined, { encoding: 'utf8' })

        Logger.info(`${magenta('[DOWNLOADING]')}${green('[DONE]')} Figure Map`)

        const swfs = await this.parser.parseFigureMap(figureMap)

        if (swfs.length > 0) {
            const data = await this.extractSWFs(swfs)

            await Promise.all(data.map(async data => {
                const { name } = data

                Logger.info(`${cyanBright('[GENERATING]')}${red('[IMAGES]')} ${name}`)

                const { metaData, paths } = await this.generator.generateImages(data)

                Logger.info(`${cyanBright('[GENERATING]')}${magentaBright('[METADATA]')} ${name}`)

                await this.generator.generateMetaData(metaData, name)

                Logger.info(`${cyanBright('[GENERATING]')}${bgBlue('[SPRITESHEET]')} ${name}`)

                await this.generator.generateSpritesheet(paths, name)

                Logger.info(`${cyanBright('[GENERATING]')}${green('[DONE]')} ${name}`)
            }))

            Logger.info(`${green('[DONE]')} Closing the ${green('Application')}...`)
        }

        else {
            Logger.info(`There is ${yellowBright('No Data')} to ${magenta('Download')}. Closing the ${green('Application')}...`)
        }
    }

    private async extractSWFs(swfs: { name: string, rawData: Buffer }[]): Promise<{ name: string, images: Image[], symbols: string[] }[]> {
        let data: { name: string, images: Image[], symbols: string[] }[] = []

        await Promise.all(swfs.map(async swf => {
            const { name, images, symbols } = await this.extractSWF(swf)
            data.push({ name, images, symbols })
        }))

        return data
    }

    private async extractSWF(swf: { name: string, rawData: Buffer }): Promise<{ name: string, images: Image[], symbols: string[] }> {
        const { name, rawData } = swf

        Logger.info(`${blueBright('[EXTRACTING]')}${cyan('[SWF]')} ${name}`)

        let { tags } = await readFromBufferP(rawData)

        Logger.info(`${blueBright('[EXTRACTING]')}${red('[IMAGES]')} ${name}`)

        const images = await Promise.all(extractImages(tags))

        tags = tags.filter(tag => {
            return tag.code === 76
        })

        Logger.info(`${blueBright('[EXTRACTING]')}${yellow('[SYMBOLS]')} ${name}`)

        const symbols = this.extractSymbols(tags)

        Logger.info(`${blueBright('[EXTRACTING]')}${green('[DONE]')} ${name}`)

        return { name, images, symbols }
    }

    private extractSymbols(tags: Tag[]) {
        const symbols: string[] = []

        tags.forEach(tag => {
            this.parser.parseRawBuffer(tag.rawData, symbols)
        })

        return symbols
    }
}