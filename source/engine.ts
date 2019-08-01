import { Game, Types, WEBGL, Scale } from 'phaser'

import Room from './rooms/room'

export default class Engine {
    private readonly config: Types.Core.GameConfig
    private readonly game: Game

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

        this.game = new Game(this.config)

        console.info({ game: this.game })

        this.goToRoom('CdUSYdhd83HDHjsdAs8sd8')

        console.info({ sceneManager: this.game.scene })
    }

    private goToRoom(id: string) {
        this.room = new Room(id, this)

        this.game.scene.add(id, this.room, true)
        this.game.scene.start(id)
    }
}

const engine = new Engine()