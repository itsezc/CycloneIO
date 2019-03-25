import Phaser from 'phaser'
import SocketIO from 'socket.io-client'

import Constants from '../../network/constants.json'
import Config from '../../../config.json'

import Room from './room'
import GameMap from './map'
import RoomModel from './model'
import Player from './player'

class RoomScene extends Phaser.Scene {
	constructor() {
		super({ key: Constants.client.scenes.ROOM })
	}

	preload() {
		this.load.path = 'web-build/'
		this.load.image(Constants.client.assets.TILE, 'v2/images/assets/tile.png', { frameWidth: 32, frameHeight: 32 })
		this.load.image('hover_tile', 'v2/images/assets/hover_tile.png', { frameWidth: 32, frameHeight: 32 })
		this.load.image('wall_right', 'v2/images/assets/wall_right.png');
		this.load.image('wall_left', 'v2/images/assets/wall_left.png');
		this.load.image('door', 'v2/images/assets/door.png');
		this.load.image('player', 'v2/images/assets/player.png');
		this.load.image('walk', 'v2/images/assets/walk.png');
		this.load.image('room_bg', 'v2/images/assets/bg.png')
	}

	init() {
		this.cameras.main.centerOn(this.cameras.main.centerX / 4, this.cameras.main.centerY / 4);

		this.input.on('pointermove', pointer => {
			if (pointer.primaryDown) {
				this.cameras.main.scrollX += pointer.downX - pointer.x;
				pointer.downX = pointer.x;

				this.cameras.main.scrollY += pointer.downY - pointer.y;
				pointer.downY = pointer.y;

				this.cameraScroll = true;
			}

			else this.cameraScroll = false
		})


        this.socket = SocketIO(`${Config.server.protocol}://${Config.server.host}:${Config.server.port}`)

        this.room = new Room(this, this.socket, 0)
        this.player = new Player(this, this.socket, 0, { x: 0, y: 0, direction: Constants.common.directions.DOWN })
    }

    create() {
        this.room.create()
        this.player.create()

		let room = new Room(0, 'Test 1', 'Testing', false)

		// var s = this.add.sprite(-100, 0, 'room_bg')
		 let gameMap = new GameMap(this,
		   [

			   // [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			   // [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			   // [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			   // [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			   // [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			   // [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			   // [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			   // [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			   // [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			   // [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			   // [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			   // [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			   // [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			   // [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			   // [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			   // [1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
			   // [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			   // [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			   // [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			   // [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			   // [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

			 [4, 3, 3, 3, 3, 3, 3],
			 [2, 0, 0, 0, 0, 0, 0],
			 [2, 0, 0, 0, 0, 0, 0],
			 [2, 0, 0, 0, 0, 0, 0],
			 [2, 0, 0, 0, 0, 0, 0],
			 [2, 0, 1, 1, 1, 0, 0],
			 [2, 0, 1, 0, 1, 0, 0],
			 [2, 0, 1, 1, 1, 0, 0],
			 [2, 0, 0, 0, 0, 0, 0],
			 [2, 0, 0, 0, 0, 0, 0],
			 [2, 0, 0, 0, 0, 0, 0],
			 [2, 0, 0, 0, 0, 0, 0],
			 [2, 0, 0, 0, 0, 0, 0]
		   ]
		 );

		 let roomModel = new RoomModel(this, gameMap)
		 roomModel.createRoom(room)

        this.anims.create({
            key: Constants.common.directions.LEFT,
            frames: this.anims.generateFrameNumbers(Constants.client.assets.PLAYER, { start: 3, end: 5 }),
            frameRate: 13,
            repeat: -1
        })

        this.anims.create({
            key: Constants.common.directions.RIGHT,
            frames: this.anims.generateFrameNumbers(Constants.client.assets.PLAYER, { start: 6, end: 8 }),
            frameRate: 13,
            repeat: -1
        })

        this.anims.create({
            key: Constants.common.directions.UP,
            frames: this.anims.generateFrameNumbers(Constants.client.assets.PLAYER, { start: 9, end: 11 }),
            frameRate: 13,
            repeat: -1
        })

        this.anims.create({
            key: Constants.common.directions.DOWN,
            frames: this.anims.generateFrameNumbers(Constants.client.assets.PLAYER, { start: 0, end: 2 }),
            frameRate: 13,
            repeat: -1
        })
    }
}

export default RoomScene
