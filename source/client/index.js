import RoomScene from './rooms/scene.js'

const config = {
	title: 'Cyclone',
    type: Phaser.WEBGL,
    physics: {
        default: 'arcade'
    },
    pixelArt: true,
    antialias: true,
    scale: {
        mode: Phaser.Scale.RESIZE,
		width: window.innerWidth * window.devicePixelRatio,
		height: window.innerHeight * window.devicePixelRatio,
		zoom: 1 / window.devicePixelRatio
    },
    audio: {
        disableWebAudio: true
    },
    scene: RoomScene
}


const game = new Phaser.Game(config)

//FPS
console.log('FPS', game.loop.actualFps)
