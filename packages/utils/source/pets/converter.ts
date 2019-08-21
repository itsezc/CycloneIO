import { readFromBufferP, extractImages, SWF, Tag, Image } from 'swf-extract'

import FileSystem from 'fs'

import Path from 'path'

import Spritesmith, { Result } from 'spritesmith'

import { ABSOLUTE_PATH } from './index'

type MetaData = {
    code: number,
    characterId: number,
    imgType: string,
    imgName: string
}

export default class PetConverter {
    private readonly metaData: MetaData[]
    private readonly imgsSources: Map<string, string[]>

    public constructor() {
        this.metaData = []
        this.imgsSources = new Map<string, string[]>() // <pet name, images paths>
    }

    public extractSWF(rawData: Buffer): SWF {
        return readFromBufferP(rawData)
    }

    public async extractImages(tags: Tag[]): Promise<Image[]> {
        return Promise.all(extractImages(tags))
    }

    public async writeImages(petType: string, images: Image[]): Promise<boolean> {

        return new Promise(resolve => {
            var newImgs: Buffer[] = []
            var imgsPaths: string[] = []

            images.map(image => {
                const { code, characterId, imgType, imgData } = image
                const imgName = `${petType}_${characterId}.${imgType}`

                this.metaData.push({ code, characterId, imgType, imgName })

                const imgsPath = Path.join(ABSOLUTE_PATH, petType, 'images')
                const imgPath = Path.join(imgsPath, imgName)

                imgsPaths.push(imgPath)

                if (!FileSystem.existsSync(imgsPath)) {
                    FileSystem.mkdirSync(imgsPath)
                }

                if (!FileSystem.existsSync(imgPath)) {
                    FileSystem.writeFileSync(imgPath, imgData)
                    newImgs.push(imgData)
                }
            })

            if (newImgs.length !== 0) {
                resolve(false)
            }

            this.imgsSources.set(petType, imgsPaths)

            resolve(true)
        })
    }

    public async writeMetaData(petType: string): Promise<boolean> {

        return new Promise(resolve => {
            const imgsPath = Path.join(ABSOLUTE_PATH, petType, 'images')
            const metaDataPath = Path.join(imgsPath, 'metadata.json')

            if (!FileSystem.existsSync(imgsPath)) {
                FileSystem.mkdirSync(imgsPath)
            }

            if (FileSystem.existsSync(metaDataPath)) {
                resolve(true)
            }

            FileSystem.writeFileSync(metaDataPath, JSON.stringify(this.metaData, null, 2))

            resolve(false)
        })
    }

    public async generateSpritesheet(petType: string): Promise<boolean> {

        return new Promise((resolve, reject) => {

            let imgsSources = this.imgsSources.get(petType)

            const spritesheetImagePath = Path.join(ABSOLUTE_PATH, petType, `${petType}.png`)

            if (FileSystem.existsSync(spritesheetImagePath)) {
                resolve(false)
            }

            Spritesmith.run({ src: imgsSources }, (err: string, result: Result) => {
                if (err) {
                    reject(err)
                }

                const { image } = result

                FileSystem.writeFileSync(spritesheetImagePath, image)

                resolve(true)
            })
        })
    }
}