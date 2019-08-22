import { readFromBufferP, extractImages, SWF, Tag, Image } from 'swf-extract'

import FileSystem from 'fs'

import Path from 'path'

import Spritesmith, { Result } from 'spritesmith'

import { unpack } from 'qunpack'

import { ABSOLUTE_PATH } from './index'

type Metadata = {
    code: number,
    characterId: number,
    imgName: string,
    imgType: string,
}

export default class PetConverter {
    private readonly metadata: Metadata[]
    private readonly imagesSources: Map<string, string[]>

    public constructor() {
        this.metadata = []
        this.imagesSources = new Map<string, string[]>() // <pet name, images paths>
    }

    public extractSWF(rawData: Buffer): SWF {
        return readFromBufferP(rawData)
    }

    public async extractImages(tags: Tag[]): Promise<Image[]> {
        return Promise.all(extractImages(tags))
    }

    public async getImagesNames(tags: Tag[], petType: string): Promise<Map<any, any>> {

        return new Promise(resolve => {
            var names: Map<any, any> = new Map<any, any>()

            tags.map(tag => {
                const { code, rawData } = tag

                if (code === 76) {
                    let rawBuffer = rawData.slice(2)

                    while (rawBuffer.length > 0) {
                        let humanReadableFormat = unpack('vZ+1', rawBuffer)

                        let characterId = humanReadableFormat[0]
                        let name = humanReadableFormat[1]

                        names.set(characterId, name)

                        rawBuffer = rawBuffer.slice(2 + name.length + 1)
                    }
                }
            })

            resolve(names)
        })
    }

    public async writeImages(petType: string, images: Image[], imagesNames: Map<any, any>): Promise<boolean> {

        return new Promise(resolve => {
            var newImages: Buffer[] = []
            var imagePathNames: string[] = []

            const imagesPath = Path.join(ABSOLUTE_PATH, petType, 'images')

            if (!FileSystem.existsSync(imagesPath)) {
                FileSystem.mkdirSync(imagesPath)
            }

            images.map(image => {
                const { code, characterId, imgType, imgData } = image

                let imageIndex = images.indexOf(image)

                let imgName = imagesNames.get(imageIndex)

                this.metadata.push({ code, characterId, imgName, imgType })

                const imagePath = Path.join(imagesPath, `${imgName}.${imgType}`)

                if (!FileSystem.existsSync(imagePath)) {
                    FileSystem.writeFileSync(imagePath, imgData)
                    newImages.push(imgData)
                }

                imagePathNames.push(imagePath)
            })

            if (newImages.length !== 0) {
                resolve(false)
            }

            this.imagesSources.set(petType, imagePathNames)

            resolve(true)
        })
    }

    public async writeMetadata(petType: string): Promise<boolean> {

        return new Promise((resolve, reject) => {
            const imgsPath = Path.join(ABSOLUTE_PATH, petType, 'images')
            const metadataPath = Path.join(imgsPath, 'metadata.json')

            if (!FileSystem.existsSync(imgsPath)) {
                FileSystem.mkdirSync(imgsPath)
            }

            if (FileSystem.existsSync(metadataPath)) {
                resolve(true)
            }

            if (this.metadata === undefined) {
                reject(false)
            }

            FileSystem.writeFileSync(metadataPath, JSON.stringify(this.metadata, null, 2))

            resolve(false)
        })
    }

    public async generateSpritesheet(petType: string): Promise<boolean> {

        return new Promise((resolve, reject) => {

            let imagesSources = this.imagesSources.get(petType)

            const spritesheetImagePath = Path.join(ABSOLUTE_PATH, petType, `${petType}.png`)

            if (FileSystem.existsSync(spritesheetImagePath)) {
                resolve(false)
            }

            Spritesmith.run({ src: imagesSources }, (err: string, result: Result) => {
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