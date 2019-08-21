import { readFromBufferP, extractImages, SWF, Tag, Image } from 'swf-extract'

import FileSystem from 'fs'

import Path from 'path'

import Spritesmith, { Img } from 'spritesmith'

const ABSOLUTE_PATH = Path.join(__dirname, '..', '..', '..', '..', 'web-gallery', 'pets')

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

    public writeImages(petType: string, images: Image[]): boolean {
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
            return false
        }

        this.imgsSources.set(petType, imgsPaths)

        return true
    }

    public writeMetaData(petType: string): boolean {
        const imgsPath = Path.join(ABSOLUTE_PATH, petType, 'images')
        const metaDataPath = Path.join(imgsPath, 'metadata.json')

        if (!FileSystem.existsSync(imgsPath)) {
            FileSystem.mkdirSync(imgsPath)
        }

        if (FileSystem.existsSync(metaDataPath)) {
            return true
        }

        FileSystem.writeFileSync(metaDataPath, JSON.stringify(this.metaData, null, 2))

        return false
    }

    public generateSpritesheet(petType: string): boolean {

        let imgsSources = this.imgsSources.get(petType)

        const spritesheetPath = Path.join(ABSOLUTE_PATH, petType)

        // Spritesmith.run({ src: imgsSources }, (err: string, result: Result) => {
        //     if (err) {
        //         throw err
        //     }

        //     result.image // Buffer representation of image
        //     result.coordinates // Object mapping filename to {x, y, width, height} of image
        //     result.properties
        // })

        const spritesmith = new Spritesmith()

        spritesmith.createImages(imgsSources, (err: string, images: Img[]) => {
            if (err) {
                throw err
            }
  
            console.log(images[0].height)
        })

        return false
    }
}