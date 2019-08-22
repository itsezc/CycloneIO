import Download from 'download'

import Path from 'path'

import FileSystem from 'fs'

import Config from './config.json'

import Logger from '../logger'

import { ABSOLUTE_PATH, OUTPUT_PATH } from './index'

type DownloadData = {
    petType: string,
    rawData: Buffer
}

export default class PetDownloader {
    private readonly data: DownloadData[]

    public constructor() {
        this.data = []
    }

    public async getDownloadData(): Promise<DownloadData[]> {

        return new Promise(resolve => {
            const { flashClientURL, SWFProduction, petAssets: assets } = Config

            assets.forEach(async asset => {

                const petPath = Path.join(ABSOLUTE_PATH, asset)

                if (!FileSystem.existsSync(petPath)) {
                    FileSystem.mkdirSync(petPath)
                }

                const SWFPath = Path.join(OUTPUT_PATH, `${asset}.swf`)

                if (!FileSystem.existsSync(SWFPath)) {
                    let data = await Download(`${flashClientURL}/${SWFProduction}/${asset}.swf`, OUTPUT_PATH)

                    Logger.info(`SWF -> DONE [${asset}]`)

                    this.data.push({ petType: asset, rawData: data })
                }

                else {
                    let data = FileSystem.readFileSync(SWFPath)
                    this.data.push({ petType: asset, rawData: data })
                }

            })

            resolve(this.data)
        })
    }
}