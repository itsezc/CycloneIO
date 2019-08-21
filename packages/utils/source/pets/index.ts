import PetDownloader from './downloader'
import PetConverter from './converter'

import Logger from '../logger'

class PetUtility {
    private readonly downloader: PetDownloader
    private readonly converter: PetConverter

    public constructor() {
        this.downloader = new PetDownloader()
        this.converter = new PetConverter()

        this.execute()
    }

    private execute(): void {
        let downloads = this.downloader.getDownloads()

        const { downloadPromises, downloadData } = downloads

        downloadPromises.then(promises => {
            if (promises.length === 0) {
                Logger.info('Everything is up-to-date! :)')
                process.exit(0)
            }

            downloadData.forEach(async (data) => {
                const { petType, rawData } = data

                const swf = await this.converter.extractSWF(rawData)

                const { tags } = swf

                const images = await this.converter.extractImages(tags)

                let imagesExists = this.converter.writeImages(petType, images)

                if (!imagesExists) {
                    Logger.info('Images -> DONE')
                }

                let metaDataExists = this.converter.writeMetaData(petType)

                if (!metaDataExists) {
                    Logger.info('Metadata -> DONE')
                }

                let spritesheetGenerated = this.converter.generateSpritesheet(petType)

                if (spritesheetGenerated) {
                    Logger.info('Spritesheet -> DONE')
                }
            })
        })
    }
}

new PetUtility()