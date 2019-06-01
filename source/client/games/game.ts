import { Game, WEBGL, Scale } from 'phaser'

const { ScaleModes } = Scale 
const { RESIZE } = ScaleModes

import Room from '../rooms/room'

const config = {
    resolution: window.devicePixelRatio,
    type: WEBGL,
    scene: new Room(0), // To change this on the navigator
	parent: 'game',
    disableContextMenu: false,
    render: {
        pixelArt: true
    },
    physics: {
        default: 'arcade'
    },
    scale: {
        mode: RESIZE,
        width: window.innerWidth,
        height: window.innerHeight
    }
}

/*
    The main game class (Habbo)
*/
const game = new Game(config)