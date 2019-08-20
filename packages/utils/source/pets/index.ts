import PetDownloader from './downloader'
import PetConverter from './converter'
import Logger from '../logger';

class PetUtility {
    private readonly downloader: PetDownloader
    private readonly converter: PetConverter

    public constructor() {
        this.downloader = new PetDownloader()
        this.converter = new PetConverter()

        this.initialize()
    }

    private initialize(): void {
        let downloads = this.downloader.getDownloads()

        downloads.downloadPromises.then(promises => {
            if (promises.length === 0) {
                Logger.info('Everything is up-to-date! :)')
                process.exit(0)
            }

            console.log(downloads.downloadData)
        })
    }
}

new PetUtility()