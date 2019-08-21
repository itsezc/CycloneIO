import Download from 'download'

import Path from 'path'

import FileSystem from 'fs'

import Config from './config.json'

import Logger from '../logger'

type DownloadData = {
    petType: string,
    rawData: Buffer
}

type DownloadOutput = {
    downloadPromises: Promise<(void | Buffer)[]>,
    downloadData: DownloadData[]
}

export default class PetDownloader {
    private readonly downloads: Promise<void | Buffer>[]
    private readonly downloadData: DownloadData[]

    public constructor() {
        this.downloads = []
        this.downloadData = []
    }

    public getDownloads(): DownloadOutput {
        const { flashClientURL, SWFProduction, petAssets } = Config

        const path = Path.join(__dirname, '../../out/pets')

        Logger.info('Downloading assets...')

        petAssets.forEach(petAsset => {

            let assetExists = FileSystem.existsSync(Path.join(path, `${petAsset}.swf`))

            if (assetExists) {

                let download = Download(`${flashClientURL}/${SWFProduction}/${petAsset}.swf`, path).then(data => {
                    Logger.info(`${petAsset}.swf -> DONE`)
                    this.downloadData.push({ petType: petAsset, rawData: data })
                })

                this.downloads.push(download)
            }

        })

        let downloadPromises = Promise.all(this.downloads)

        return { downloadPromises, downloadData: this.downloadData }
    }
}