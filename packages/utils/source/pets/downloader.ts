import Download from 'download'

import Path from 'path'

import FileSystem from 'fs'

import Config from '../../config.json'

import Logger from '../logger'

import { ABSOLUTE_PATH, OUTPUT_PATH } from './index'

type DownloadData = {
    pet: string,
    rawData: Buffer
}

export default class PetDownloader {
    private readonly data: DownloadData[]

    public constructor() {
        this.data = []
    }

    public async getDownloadData(): Promise<DownloadData[]> {

        return new Promise(async resolve => {

            let downloads: Promise<Buffer>[] = []

            const { flashClientURL, SWFProduction, petAssets: assets } = Config

            assets.forEach(asset => {

                const petPath = Path.join(ABSOLUTE_PATH, asset)

                if (!FileSystem.existsSync(petPath)) {
                    FileSystem.mkdirSync(petPath)
                }

                const SWFPath = Path.join(OUTPUT_PATH, `${asset}.swf`)

                if (!FileSystem.existsSync(SWFPath)) {
                    let download = Download(`${flashClientURL}/${SWFProduction}/${asset}.swf`, OUTPUT_PATH)

                    download.then(data => {
                        Logger.info(`SWF -> DONE [${asset}]`)
                        this.data.push({ pet: asset, rawData: data })
                    })

                    downloads.push(download)

                }

                else {
                    let data = FileSystem.readFileSync(SWFPath)
                    this.data.push({ pet: asset, rawData: data })
                }

            })

            await Promise.all(downloads)

            resolve(this.data)
        })
    }
}