import { GameObjects, Math } from 'phaser'

import AvatarImager from '../avatar/imager'
import AvatarFigure from '../avatar/figure'

import AvatarDirection, { AvatarPartsDirection } from '../avatar/direction'
import AvatarGesture, { Gestures } from '../avatar/gesture'
import { Actions } from '../avatar/action'
import { Scales } from '../avatar/scale'

import Room from './room'

import RoomObjectDepth from './depth'

const DIRECTIONS = 8 as const

export default class RoomAvatar extends GameObjects.Container {

    public constructor(public readonly scene: Room,

                       private readonly coordinates: Math.Vector3,

                       private readonly look: string,

                       private readonly isGhost: boolean,

                       private readonly frame: number,

                       private readonly direction: AvatarPartsDirection) {

        super(scene, coordinates.x, coordinates.y - coordinates.y)

        this.scene = scene

        this.coordinates = coordinates

        this.look = look

        this.isGhost = isGhost

        this.frame = frame

        this.direction = direction

        this.setDepth(RoomObjectDepth.FIGURE)

        this.addGenericTextures()
    }

    private async addGenericTextures(): Promise<void> {
        const { AvatarImager } = this.scene.Engine

        for (let direction = 0 as AvatarDirection; direction < DIRECTIONS; direction++) {

            await this.addHeadTexture(AvatarImager, direction, Gestures.STAND, 0)
            await this.addHeadTexture(AvatarImager, direction, Gestures.EYEBLINK, 0)
        }
    }

    private async addHeadTexture(avatarImager: AvatarImager, direction: AvatarDirection, gesture: AvatarGesture, frame: number): Promise<void> {
        const { Engine } = this.scene

        const avatar = new AvatarFigure(Engine, this.look, { head: direction, body: direction }, Actions.STAND,
                                        null, gesture, frame, true, false, null)

        const image = avatarImager.generateGenericTexture(avatar, this.isGhost)
    }
}