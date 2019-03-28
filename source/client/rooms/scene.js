import Constants from '../../network/constants.json'
import Config from '../../../config.json'

import Room from './room'
import RoomPlayer from './player'

class RoomScene extends Phaser.Scene {
  constructor() {
    super({
      key: Constants.client.scenes.ROOM
    })
  }

  preload() {
    this.load.path = 'web-build/'
    this.load.image(Constants.client.assets.TILE, 'images/tile.png')
    var image = this.load.spritesheet(Constants.client.assets.HH_HUMAN_BODY, 'sprites/hh_human_body.png', {
      frameWidth: 10,
      frameHeight: 10
    })
    // this.load.image('hover_tile', 'assets/hover_tile.png')
    // this.load.image('wall_right', 'assets/wall_right.png');
    // this.load.image('wall_left', 'assets/wall_left.png');
    // this.load.image('door', 'assets/door.png');
    //this.load.image(Constants.client.assets.PLAYER, 'assets/player.png');
    // this.load.image('walk', 'assets/walk.png');
    // this.load.image('room_bg', 'assets/bg.png')
  }

  init() {
    this.socket = io(`${Config.server.host}:${Config.server.port}`)
    this.camera = this.cameras.main
    this.room = new Room(this, this.socket, 0)
    this.player = new RoomPlayer(this, this.socket, 0, {
      x: 0,
      y: 0,
      direction: Constants.common.directions.DOWN
    })

    // TODO: better camera centering
    this.camera.centerOn(this.camera.centerX / 4, this.camera.centerY / 4)

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
    this.player.create()
  //
  //   this.anims.create({
  //     key: Constants.common.directions.LEFT,
  //     frames: this.anims.generateFrameNumbers(Constants.client.assets.HUMAN_BODY, {
  //       start: 3,
  //       end: 5
  //     }),
  //     frameRate: 13,
  //     repeat: -1
  //   })
  //
  //   this.anims.create({
  //     key: Constants.common.directions.RIGHT,
  //     frames: this.anims.generateFrameNumbers(Constants.client.assets.HUMAN_BODY, {
  //       start: 6,
  //       end: 8
  //     }),
  //     frameRate: 13,
  //     repeat: -1
  //   })
  //
  //   this.anims.create({
  //     key: Constants.common.directions.UP,
  //     frames: this.anims.generateFrameNumbers(Constants.client.assets.HUMAN_BODY, {
  //       start: 9,
  //       end: 11
  //     }),
  //     frameRate: 13,
  //     repeat: -1
  //   })
  //
  //   this.anims.create({
  //     key: Constants.common.directions.DOWN,
  //     frames: this.anims.generateFrameNumbers(Constants.client.assets.HUMAN_BODY, {
  //       start: 0,
  //       end: 2
  //     }),
  //     frameRate: 13,
  //     repeat: -1
  //   })
  }
}

export default RoomScene
