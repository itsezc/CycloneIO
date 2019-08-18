import HabboEngine from '../games/habbo'

import AvatarFigure, { FigurePart } from './figure'
import AvatarAction, { Actions } from './action'
import AvatarDirection from './direction'

const LOCAL_RESOURCES = 'https://images.bobba.io/resource' as const

type ActivePartSet = {
    rectangle: string[],
    head: string[],
    eye: string[],
    gesture: string[],
    speak: string[],
    walk: string[],
    itemRight: string[],
    handRight: string[],
    handLeft: string[],
    swim: string[]
}

export default class AvatarImager {

    private figureMap: any
    private figureData: any
    private partSets: any
    private drawOrder: any
    private animations: any

    public constructor(private readonly engine: HabboEngine) {
        this.engine = engine
    }

    public async fetchResources(): Promise<void> {

        this.figureMap = await this.fetchResource(`${LOCAL_RESOURCES}/map.json`)

        this.figureData = await this.fetchResource(`${LOCAL_RESOURCES}/figuredata.json`)

        this.partSets = await this.fetchResource(`${LOCAL_RESOURCES}/partsets.json`)

        this.drawOrder = await this.fetchResource(`${LOCAL_RESOURCES}/draworder.json`)

        this.animations = await this.fetchResource(`${LOCAL_RESOURCES}/animation.json`)
    }

    private async fetchResource(URL: string): Promise<any> {

        const options: RequestInit = {
            method: 'GET',
            mode: 'cors',
            cache: 'default',
        }

        let response = await fetch(URL, options)
        let data = await response.json()

        return data
    }

    public generateGenericTexture(avatar: AvatarFigure, isGhost: boolean) {
        let activePartSet: ActivePartSet = this.getActivePartSet(avatar)

        let drawOrder = this.getDrawOrder(avatar.DrawOrder, avatar.Direction.body)

        if (!drawOrder) {
            drawOrder = this.getDrawOrder(Actions.STAND, avatar.Direction.body)
        }

        avatar.Parts.forEach(figurePart => {
            const partColor = this.getPartColor(figurePart)
        })
    }

    private getActivePartSet(avatar: AvatarFigure): ActivePartSet {

        let rectangle = this.getActivePart(avatar.IsHeadOnly ? 'head' : 'figure')

        let head = this.getActivePart('head')
        let eye = this.getActivePart('eye')
        let gesture = this.getActivePart('gesture')
        let speak = this.getActivePart('speak')

        let walk = this.getActivePart('walk')
        let sit = this.getActivePart('sit')

        let itemRight = this.getActivePart('itemRight')
        let handRight = this.getActivePart('handRight')
        let handLeft = this.getActivePart('handLeft')

        let swim = this.getActivePart('swim')

        return { rectangle, head, eye, gesture, speak, walk, sit, itemRight, handRight, handLeft, swim } as ActivePartSet

    }

    private getActivePart(part: string): string[] {
        return this.partSets['activePartSet'][part]['activePart']
    }

    private getDrawOrder(drawOrderAction: string, direction: AvatarDirection): string[] {
        return this.drawOrder[drawOrderAction][direction]
    }

    private getPartColor(part: FigurePart) {
        const { type } = part

    }
}