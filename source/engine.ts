import { Types, Game, WEBGL, Scale } from 'phaser'

import Room from './rooms/room'

import AvatarImager from './avatar/imager'

export default class Engine {
    private readonly config: Types.Core.GameConfig
    private readonly game: Game
    private readonly avatarImager: AvatarImager

    private room: Room

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

        this.game = new Phaser.Game(this.config)

        console.info({ game: this.game }, 'ready')

        this.goToRoom('CdUSYdhd83HDHjsdAs8sd8')

        this.avatarImager = new AvatarImager(this)

        this.avatarImager.initialize().then(() => {
            console.info({ avatarImager: this.avatarImager }, 'ready')
        })

        console.info({ sceneManager: this.game.scene }, 'ready')
    }

    private goToRoom(id: string) {
        this.room = new Room(id, this)

        this.game.scene.add(id, this.room, true)
        this.game.scene.start(id)
    }
}

const engine = new Engine()