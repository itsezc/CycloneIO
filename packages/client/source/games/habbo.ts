import { Types, Game, WEBGL, Scale } from 'phaser'

import Room from '../rooms/room'

import AvatarImager from '../avatar/imager'

export default class HabboEngine {
    private readonly config: Types.Core.GameConfig
    private readonly game: Game
    private readonly avatarImager: AvatarImager

    public constructor() {
        this.config = {
            resolution: window.devicePixelRatio,
            type: WEBGL,
            parent: 'game',
            banner: false,
            render: {
                pixelArt: true
            },
            scale: {
                mode: Scale.ScaleModes.RESIZE,
                width: window.innerWidth,
                height: window.innerHeight,
            }
        }

        this.game = new Game(this.config)

        console.info({ game: this.game }, 'ready')

        this.goToRoom('CdUSYdhd83HDHjsdAs8sd8')

        // this.avatarImager = new AvatarImager(this)

        // this.avatarImager.fetchResources().then(() => {
        //     console.info({ avatarImager: this.avatarImager }, 'ready')
        // })
    }

    private goToRoom(id: string): void {
        let room = new Room(id, this)

        this.game.scene.add(id, room, true)
    }

    public get AvatarImager(): AvatarImager {
        return this.avatarImager
    }
}

new HabboEngine()