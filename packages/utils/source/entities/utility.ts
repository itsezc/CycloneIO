import { injectable } from 'inversify'

import { join } from 'path'

import { access, constants } from 'fs'

import { Image } from 'swf-extract'

import { IPetUtility, IPetDownloader, IPetExtractor, IPetConverter, IPetMapper } from '../interfaces'

import { container, Types } from '../injectors'

import { assets } from '../../config.json'

import Logger from '../logging/logger'

import { SWFExtractedData, SWFBinaryData } from './extractor';

import { MapRootObject } from '../models'

export const ABSOLUTE_PATH = join(__dirname, '..', '..', '..', '..', 'web-gallery', 'pets')

@injectable()
export class PetUtility implements IPetUtility {
    private extractor: IPetExtractor
    private converter: IPetConverter

    main(downloader: IPetDownloader) {
        assets.map(asset => {
            const assetPath = join(ABSOLUTE_PATH, asset)

            access(assetPath, constants.F_OK, err => {
                if (err) {
                    Logger.info(`${asset} is missing... Getting a new one!`)
                    this.processSWF(downloader, asset)
                }

                else {
                    Logger.info(`Everything is up-to-date! [${asset}]`)
                }
            })
        })
    }

    private async processSWF(downloader: IPetDownloader, asset: string) {
        let data = await downloader.downloadSWF(asset)

        Logger.info(`Downloaded ${asset}.swf!`)

        await this.processData(asset, data)

        Logger.info(`Processed ${asset} SWF data!`)
    }

    private async processData(asset: string, data: Buffer) {
        let extractedData = await this.extractData(asset, data)

        Logger.info(`Extracted ${asset} data!`)

        const { images, symbols, binaryData } = extractedData

        let map = await this.mapBinaryData(binaryData)

        Logger.info(`Mapped ${asset} SWF binary data!`)

        await this.convertData(images, symbols, asset, map)

        Logger.info(`Converted ${asset} SWF data!`)
    }

    private async extractData(asset: string, data: Buffer): Promise<SWFExtractedData> {
        this.extractor = container.get<IPetExtractor>(Types.IPetExtractor)

        const swf = await this.extractor.extractSWF(data)

        Logger.info(`Extracted ${asset} SWF!`)

        const { tags } = swf

        const images = await this.extractor.extractImages(tags)

        Logger.info(`Extracted ${asset} images!`)

        let symbolTags = this.extractor.extractSymbolTags(tags)
        let symbols = this.extractor.extractSymbols(symbolTags, asset)

        Logger.info(`Extracted ${asset} symbols!`)

        let binaryDataTags = this.extractor.extractBinaryDataTags(tags)
        let binaryData = this.extractor.extractBinaryData(binaryDataTags)

        Logger.info(`Extracted ${asset} binary data!`)

        return { images, symbols, binaryData }
    }

    private mapBinaryData(binaryData: SWFBinaryData): MapRootObject {
        const { index, logic, assets, visualization } = binaryData

        const map: MapRootObject = {} as const

        container.get<IPetMapper>(Types.IPetMapper)
            .mapIndex(index, map)
            .mapAssets(assets, map)
            .mapLogic(logic, map)
            .mapVisualizations(visualization, map)

        return map
    }

    private async convertData(images: readonly Image[], symbols: readonly string[], asset: string, map: MapRootObject) {
        this.converter = container.get<IPetConverter>(Types.IPetConverter)

        let filePaths = await this.converter.convertSWFImagesToPNG(images, symbols, asset)

        Logger.info(`Converted SWF Images to PNG format in the images ${asset} folder!`)

        await this.converter.generateMetadata(asset)

        Logger.info(`Generated ${asset} metadata!`)

        this.converter.convertPNGImagesToSpritesheet(filePaths, asset)

        Logger.info(`Converted ${asset} images to spritesheet!`)

        await this.converter.generateMap(asset, map)

        Logger.info(`Generated ${asset}.json map data!`)
    }
}