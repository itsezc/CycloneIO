import Phaser from 'phaser'
import React from 'react'
import ReactDOM from 'react-dom'

var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
		    gravity: { y: 200 }
		}
	},
	scene: {
		preload: preload,
		create: create
	}
}

var game = new Phaser.Game(config)
