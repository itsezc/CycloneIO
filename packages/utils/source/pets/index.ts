import Path from 'path'

import FileSystem from 'fs'

import PetDownloader from './downloader'
import PetConverter from './converter'
import PetMapper from './mapper'

import Logger from '../logger'

import { AssetsRootObject } from './types/assets'
import { IndexRootObject } from './types'
import { LogicRootObject } from './types/logic'
import { VisualizationRootObject } from './types/visualization'

export const ABSOLUTE_PATH = Path.join(__dirname, '..', '..', '..', '..', 'web-gallery', 'pets')
export const OUTPUT_PATH = Path.join(__dirname, '../../out/pets')

class PetUtility {
    private readonly downloader: PetDownloader
    private readonly converter: PetConverter

    public constructor() {
        this.downloader = new PetDownloader()
        this.converter = new PetConverter()

        this.execute()
    }

    private async execute(): Promise<void> {

        if (!FileSystem.existsSync(ABSOLUTE_PATH)) {
            FileSystem.mkdirSync(ABSOLUTE_PATH)
        }

        let data = await this.downloader.getDownloadData()

        data.forEach(async singleData => {

            const { pet, rawData } = singleData

            const swf = await this.converter.extractSWF(rawData)

            const { tags } = swf

            const images = await this.converter.extractImages(tags)

            let binaryData = await this.converter.extractBinaryData(tags)

            const { assets, index, logic, visualization } = binaryData

            const mapper = new PetMapper(assets, index, logic, visualization)

            mapper.generateMappedFile()

            const symbols = await this.converter.extractSymbols(tags, pet)

            var imagesExists = await this.converter.writeImages(images, symbols, pet)

            if (!imagesExists) {
                Logger.info(`Images -> DONE [${pet}]`)
            }

            var metadataExists = await this.converter.writeMetadata(pet)

            if (!metadataExists) {
                Logger.info(`Metadata -> DONE [${pet}]`)
            }

            var spritesheetGenerated = await this.converter.generateSpritesheet(pet)

            if (spritesheetGenerated) {
                Logger.info(`Spritesheet -> DONE [${pet}]`)
            }

            Logger.info(`Everything is up-to-date! [${pet}]`)

        })
    }
}

new PetUtility()