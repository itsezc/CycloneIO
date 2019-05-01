import RoomScene from './rooms/scene.js'

const config = {
    type: Phaser.CANVAS,
    scene: RoomScene,
    disableContextMenu: false,
    banner: false,
    render: {
       antialias: false
    },
    physics: {
        default: 'arcade'
    },
    scale: {
        mode: Phaser.Scale.ScaleModes.ENVELOP,
        width: window.innerWidth * window.devicePixelRatio,
        height: window.innerHeight * window.devicePixelRatio
    }
}

const game = new Phaser.Game(config)