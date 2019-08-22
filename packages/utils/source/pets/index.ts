import Path from 'path'

import PetDownloader from './downloader'
import PetConverter from './converter'

import Logger from '../logger'

export const ABSOLUTE_PATH = Path.join(__dirname, '..', '..', '..', '..', 'web-gallery', 'pets')

class PetUtility {
    private readonly downloader: PetDownloader
    private readonly converter: PetConverter

    public constructor() {
        this.downloader = new PetDownloader()
        this.converter = new PetConverter()

        this.execute()
    }

    private execute(): void {

        this.downloader.getDownloads().then(datas => {

            datas.forEach(async (data) => {

                const { petType, rawData } = data

                const swf = await this.converter.extractSWF(rawData)

                const { tags } = swf

                const images = await this.converter.extractImages(tags)

                const imagesNames = await this.converter.getImagesNames(tags, petType)

                var imagesExists = await this.converter.writeImages(petType, images, imagesNames)

                if (!imagesExists) {
                    Logger.info(`Images -> DONE [${petType}]`)
                }

                var metaDataExists = await this.converter.writeMetadata(petType)

                if (!metaDataExists) {
                    Logger.info(`Metadata -> DONE [${petType}]`)
                }

                var spritesheetGenerated = await this.converter.generateSpritesheet(petType)

                if (spritesheetGenerated) {
                    Logger.info(`Spritesheet -> DONE [${petType}]`)
                }

            })
        })
    }
}

new PetUtility()