import Config from '../../config.json'
import RoomScene from './hotel/rooms/scene.js'

class Game extends Phaser.Game {
    constructor(config) {
        super(config)
        this.socket = io(`${Config.server.host}:${Config.server.port}`)
    }
}

const config = {
    type: Phaser.WEBGL,
    scene: RoomScene,
    disableContextMenu: false,
    render: {
        pixelArt: true
    },
    physics: {
        default: 'arcade'
    },
    scale: {
        mode: Phaser.Scale.ScaleModes.RESIZE,
        width: window.innerWidth,
        height: window.innerHeight
    }
}

const game = new Game(config)
