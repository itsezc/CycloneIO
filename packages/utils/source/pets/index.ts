import Path from 'path'

import FileSystem from 'fs'

import PetDownloader from './downloader'
import PetConverter from './converter'

import Logger from '../logger'

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

        data.forEach(async (singleData) => {

            const { petType, rawData } = singleData

            const swf = await this.converter.extractSWF(rawData)

            const { tags } = swf

            const images = await this.converter.extractImages(tags)
            const imageNames = await this.converter.extractImageNames(tags, petType)

            var imagesExists = await this.converter.writeImages(petType, images, imageNames)

            if (!imagesExists) {
                Logger.info(`Images -> DONE [${petType}]`)
            }

            var metadataExists = await this.converter.writeMetadata(petType)

            if (!metadataExists) {
                Logger.info(`Metadata -> DONE [${petType}]`)
            }

            var spritesheetGenerated = await this.converter.generateSpritesheet(petType)

            if (spritesheetGenerated) {
                Logger.info(`Spritesheet -> DONE [${petType}]`)
            }

            Logger.info(`Everything is up-to-date! [${petType}]`)

        })
    }
}

new PetUtility()