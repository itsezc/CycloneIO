import Download from 'download'

import Path from 'path'

import FileSystem from 'fs'

import Config from './config.json'

import Logger from '../logger'

type DownloadOutput = {
    downloadPromises: Promise<(void | Buffer)[]>,
    downloadData: Buffer[]
}

export default class PetDownloader {
    private readonly downloads: Promise<void | Buffer>[]
    private readonly downloadData: Buffer[]

    public constructor() {
        this.downloads = []
        this.downloadData = []
    }

    public getDownloads(): DownloadOutput {
        const { flashClientURL, SWFProduction, petAssets: assets } = Config

        const path = Path.join(__dirname, '../../out/pets')

        Logger.info('Downloading assets...')

        assets.forEach(asset => {

            let assetExists = FileSystem.existsSync(Path.join(path, `${asset}.swf`))

            if (!assetExists) {

                let download = Download(`${flashClientURL}/${SWFProduction}/${asset}.swf`, path).then(data => {
                    Logger.info(`${asset}.swf -> DONE`)
                    this.downloadData.push(data)
                })

                this.downloads.push(download)
            }

        })

        let downloadPromises = Promise.all(this.downloads)

        return { downloadPromises, downloadData: this.downloadData }
    }
}