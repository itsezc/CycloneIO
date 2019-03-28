import RoomScene from './rooms/scene.js'

console.log('Hello')

const config = {
	type: Phaser.CANVAS,
	physics: {
		default: 'arcade'
	},
	pixelArt: true,
	antialias: true,
	scale: {
		mode: Phaser.Scale.RESIZE
	},
	audio: {
		disableWebAudio: true
	},
	scene: RoomScene
}

const Game = new Phaser.Game(config)
