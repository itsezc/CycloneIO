import Download from 'download'

import Path from 'path'

import FileSystem from 'fs'

import Config from './config.json'

import Logger from '../logger'

import { ABSOLUTE_PATH } from './index'

type DownloadData = {
    petType: string,
    rawData: Buffer
}

export default class PetDownloader {
    private readonly datas: DownloadData[]

    public constructor() {
        this.datas = []
    }

    public async getDownloads(): Promise<DownloadData[]> {

        return new Promise(resolve => {
            const { flashClientURL, SWFProduction, petAssets } = Config

            const outputPath = Path.join(__dirname, '../../out/pets')

            if (!FileSystem.existsSync(ABSOLUTE_PATH)) {
                FileSystem.mkdirSync(ABSOLUTE_PATH)
            }

            var downloads: Promise<Buffer>[] = []

            petAssets.forEach(petAsset => {

                const petPath = Path.join(ABSOLUTE_PATH, petAsset)

                if (!FileSystem.existsSync(petPath)) {
                    FileSystem.mkdirSync(petPath)
                }

                const SWFPath = Path.join(outputPath, `${petAsset}.swf`)

                if (!FileSystem.existsSync(SWFPath)) {

                    let download = Download(`${flashClientURL}/${SWFProduction}/${petAsset}.swf`, outputPath)

                    downloads.push(download)

                    download.then(data => {
                        Logger.info(`SWF -> DONE [${petAsset}]`)
                        this.datas.push({ petType: petAsset, rawData: data })
                    })

                }

                else {
                    let data = FileSystem.readFileSync(SWFPath)
                    this.datas.push({ petType: petAsset, rawData: data })
                }

            })

            Promise.all(downloads).then(() => {
                resolve(this.datas)
            })
        })
    }
}