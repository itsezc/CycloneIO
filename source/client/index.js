import RoomScene from './rooms/scene.js'

const config = {
    type: Phaser.WEBGL,
    scene: RoomScene,
    disableContextMenu: false,
    banner: false,
    render: {
        pixelArt: true
    },
    physics: {
        default: 'arcade'
    },
    scale: {
        mode: Phaser.Scale.ScaleModes.ENVELOP,
        width: window.innerWidth * window.devicePixelRatio,
        height: window.innerHeight * window.devicePixelRatio,
        zoom: Phaser.Scale.MAX_ZOOM
    }
}

const game = new Phaser.Game(config)