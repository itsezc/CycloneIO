import { GameObjects } from 'phaser'

import Vector from '../types/vector'

import Room from './room'

import RoomObjectDepth from './objects/depth'

type AvatarParts = {
    head: GameObjects.Sprite,
    body: GameObjects.Sprite,
    shadow: GameObjects.Sprite
}

export default class RoomAvatar extends GameObjects.Container {

    private readonly isGhost: boolean

    private readonly look: string

    private readonly avatar: AvatarParts

    private readonly bodyRotation: number
    private readonly headRotation: number

    private readonly frame: number

    public constructor(public readonly scene: Room, private readonly coordinates: Vector) {
        super(scene, coordinates.x, coordinates.y - coordinates.y)

        this.scene = scene

        this.isGhost = false

        this.look = 'ca-1815-92.sh-290-62.hd-180-1009.ch-262-64.ha-3763-63.lg-280-1193.hr-831-54'

        this.frame = 0

        this.avatar = {
            head: new GameObjects.Sprite(this.scene, 0, 0, null),
            body: new GameObjects.Sprite(this.scene, 0, 0, null),
            shadow: new GameObjects.Sprite(this.scene, 0, this.avatar.head.height + this.avatar.body.height - 16, null)
        }

        this.avatar.shadow.setAlpha(0.8)

        this.setDepth(RoomObjectDepth.FIGURE)

        this.bodyRotation = 2
        this.headRotation = 2
    }
}