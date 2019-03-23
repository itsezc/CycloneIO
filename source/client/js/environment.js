import Phaser from 'phaser'
import React from 'react'
import ReactDOM from 'react-dom'

import RoomScene from './rooms/scene.js'

console.log('Test')
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

const Game = new Phaser.Game(config)
