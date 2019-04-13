import Constants from '../../network/constants.json'
import Config from '../../../config.json'

import Room from './room'
import RoomPlayer from './player'

export default class RoomScene extends Phaser.Scene {
	constructor() {
		super({
			key: Constants.client.scenes.ROOM
		})
	}

	preload() {
		this.load.path = 'web-build/'
		this.load.svg(Constants.client.assets.TILE_HOVER, 'room/tile_hover.svg')

		// this.load.image('wall_right', 'assets/wall_right.png')
		// this.load.image('wall_left', 'assets/wall_left.png')
		// this.load.image('door', 'assets/door.png')
		// this.load.image(Constants.client.assets.PLAYER, 'assets/player.png')
		// this.load.image('walk', 'assets/walk.png')
		// this.load.image('room_bg', 'assets/bg.png') ddsd


	}

	init() {
		this.socket = io(`${Config.server.host}:${Config.server.port}`)
		this.camera = this.cameras.main
		this.room = new Room(this, this.socket, 0)
		// this.player = new RoomPlayer(this, this.socket, 0, {
		//   x: 0,
		//   y: 0,
		//   direction: Constants.common.directions.DOWN
		// })

		this.camera.centerOn(this.camera.midPoint.x / window.innerWidth, this.camera.midPoint.y / window.innerHeight)

		this.input.on('pointermove', pointer => {
			if (pointer.primaryDown) {
				this.camera.scrollX += pointer.downX - pointer.x;
				pointer.downX = pointer.x;
				this.camera.scrollY += pointer.downY - pointer.y;
				pointer.downY = pointer.y;
			}
		})
	}

	create() {
		this.room.create()

		// var test = this.add.sprite(0, 0, Constants.client.assets.HH_HUMAN_BODY, '167_hh_human_body_h_blw_rh_1_7_1')
		// this.anims.create({
		//   key: 'walk',
		//   frames: this.anims.generateFrameNumbers(Constants.client.assets.HH_HUMAN_BODY, {
		//     frames: ['83_hh_human_body_h_wlk_bd_1_0_1', '167_hh_human_body_h_blw_rh_1_7_1' ]
		//   }),
		//   frameRate: 10,
		//   repeat: -1
		// })
	}
}
