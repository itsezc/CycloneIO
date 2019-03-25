import Phaser from 'phaser'

import RoomScene from './rooms/scene.js'

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
