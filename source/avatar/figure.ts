import Engine from '../engine'

import AvatarDirection, { Directions, AvatarPartsDirection } from './direction'
import AvatarAction, { Actions } from './action'
import AvatarGesture, { Gestures } from './gesture'
import AvatarScale from './scale'

export type FigurePart = {
    type: string,
    id: string,
    colors: string[]
}

type DrawAction = {
    body: string,
    walk?: string,
    sit?: string,
    gesture?: string,
    eye?: string,
    speak?: string,
    itemRight?: string,
    handRight?: string,
    handLeft?: string,
    swim?: string
}

export default class AvatarFigure {

    private readonly parts: Map<string, FigurePart>

    private isLarge: boolean
    private isSmall: boolean

    private readonly rectangleWidth: number
    private readonly rectangleHeight: number

    private readonly drawOrder: string
    private readonly drawAction: DrawAction

    constructor(private readonly engine: Engine,

                private readonly figure: string,

                private readonly direction: AvatarPartsDirection,

                private readonly action: AvatarAction, private readonly actionItemID: number,

                private readonly gesture: AvatarGesture,

                private readonly frame: number,

                private readonly isHeadOnly: boolean, private readonly isBodyOnly: boolean,

                private readonly scale: AvatarScale) {

        this.engine = engine

        this.figure = figure

        this.direction = direction

        this.action = action
        this.actionItemID = actionItemID

        this.gesture = gesture

        this.frame = frame

        this.isHeadOnly = isHeadOnly
        this.isBodyOnly = isBodyOnly

        this.scale = scale

        this.parts = this.extractParts(this.figure)

        this.drawOrder = Actions.STAND

        this.drawAction = {
            body: Actions.STAND
        }

        // #region gestures
        switch(this.gesture) {

            case Gestures.SPEAK:
                this.drawAction.speak = Gestures.SPEAK
                break

            case Gestures.EYEBLINK:
                this.drawAction.eye = Gestures.EYEBLINK
                break

            default:
                this.drawAction.gesture = this.gesture
                break
        }
        // #endregion

        // #region sit draw action
        if (this.drawAction.sit === Actions.SIT) {

            // #region front directions
            if (this.direction.body >= Directions.FRONT_RIGHT && this.direction.body <= Directions.FRONT_LEFT) {

                this.drawOrder = Actions.SIT

                if (this.drawAction.handRight === Actions.DRINK && this.direction.body >= Directions.FRONT_RIGHT
                                                                && this.direction.body <= Directions.FRONT) {

                    this.drawOrder += `.${Actions.RIGHT_HAND_UP}`
                }

                else if (this.drawAction.handLeft && this.direction.body === Directions.FRONT_LEFT) {
                    this.drawOrder += `.${Actions.LEFT_HAND_UP}`
                }

            }
            // #endregion

            // #region lay
            else if (this.drawAction.body === Actions.LAY) {
                this.drawOrder = Actions.LAY
            }
            // #endregion

            // #region hand draw order
            else if (this.drawAction.handRight === Actions.DRINK && this.direction.body >= Directions.BEHIND_RIGHT
                                                                 && this.direction.body <= Directions.FRONT) {

                this.drawOrder = Actions.RIGHT_HAND_UP
            }

            else if (this.drawAction.handLeft && this.direction.body >= Directions.FRONT_LEFT
                                              && this.direction.body <= Directions.BEHIND_LEFT) {

                this.drawOrder = Actions.LEFT_HAND_UP
            }
            // #endregion
        }
        // #endregion
    }

    private extractParts(look: string): Map<string, FigurePart> {

        let figureParts = new Map<string, FigurePart>()

        let lookParts: string[] = look.split('.')

        lookParts.forEach(lookPart => {

            let data = lookPart.split('-')

            let type = data[0]
            let id = data[1]
            let colors = [data[2]]
            let extraColor = data[3]

            const figurePart: FigurePart = { type, id, colors }

            if (extraColor) {
                figurePart.colors.push(extraColor)
            }

            figureParts.set(type, figurePart)
        })

        return figureParts
    }

    public get IsHeadOnly(): boolean {
        return this.isHeadOnly
    }

    public get DrawOrder(): string {
        return this.drawOrder
    }

    public get Direction(): AvatarPartsDirection {
        return this.direction
    }

    public get Parts(): Map<string, FigurePart> {
        return this.parts
    }
}