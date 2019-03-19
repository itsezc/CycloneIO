import RoomScene from '../rooms/scene.js'

const config = {
    type: Phaser.CANVAS,
    physics: {
        default: 'arcade'
    },
    pixelArt: true,
    antialias: false,
    scale: {
        mode: Phaser.Scale.RESIZE
    },
    audio: {
        disableWebAudio: true
    },
    scene: RoomScene,
}

const game = new Phaser.Game(config)
