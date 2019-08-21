import Path from 'path'

import PetDownloader from './downloader'
import PetConverter from './converter'

import Logger from '../logger'

export const ABSOLUTE_PATH = Path.join(__dirname, '..', '..', '..', '..', 'web-gallery', 'pets')

enum Messages {
    No_New_Data = 'Everything is up-to-date!'
}

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

                var processPromises: Promise<any>[] = []
                var fulfilledProcesses: boolean[] = []

                let imagesPromise = this.converter.writeImages(petType, images).then(imagesExists => {
                    if (!imagesExists) {
                        Logger.info(`Images -> DONE [${petType}]`)
                        fulfilledProcesses.push(imagesExists)
                    }
                })

                processPromises.push(imagesPromise)

                let metaDataPromise = this.converter.writeMetaData(petType).then(metaDataExists => {
                    if (!metaDataExists) {
                        Logger.info(`Metadata -> DONE [${petType}]`)
                        fulfilledProcesses.push(metaDataExists)
                    }
                })

                processPromises.push(metaDataPromise)

                let spritesheetPromise = this.converter.generateSpritesheet(petType).then(spritesheetGenerated => {
                    if (spritesheetGenerated) {
                        Logger.info(`Spritesheet -> DONE [${petType}]`)
                        fulfilledProcesses.push(spritesheetGenerated)
                    }
                })

                processPromises.push(spritesheetPromise)

                Promise.all(processPromises).then(() => {
                    fulfilledProcesses.length === 0 ? Logger.info(`${Messages.No_New_Data} [${petType}]`) :
                        Logger.info(`Downloaded new data! [${petType}]`)
                })
            })
        })
    }
}

new PetUtility()