import Config from '../../config.json'
import Room from './rooms/room.js'

class Game extends Phaser.Game {
    
    constructor(config) {

        super(config)
        
        this.socket = io(`${Config.server.host}:${Config.server.port}`)

    }
}

const config = {
    resolution: window.devicePixelRatio,
    type: Phaser.WEBGL,
    scene: new Room(0), // To change this on the navigator
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