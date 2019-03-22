import Phaser from 'phaser'
import SocketIO from 'socket.io-client'

import { ROOM } from '../constants/scenes.js'
import Config from '../../../../config.json'
import { TILE, PLAYER } from '../constants/assets.js'
import { UP, LEFT, DOWN, RIGHT } from '../../../common/constants/directions.js'
import Room from './room.js'
import Player from './player.js'

class RoomScene extends Phaser.Scene {
    constructor() {
        super({ key: ROOM })
    }

    preload() {
        this.load.path = 'web-build/'
        this.load.image(TILE, 'images/tile.png', { frameWidth: 32, frameHeight: 32 })
        this.load.spritesheet(PLAYER, 'sprites/player.png', { frameWidth: 32, frameHeight: 32 })
    }

    init() {
        let socket = SocketIO(`${Config.server.protocol}://${Config.server.host}:${Config.server.port}`)
        this.room = new Room(this, socket, 0)
        this.player = new Player(this, socket, 0, { x: 0, y: 0, direction: DOWN })
    }

    create() {
        this.room.create()
        this.player.create()

        this.anims.create({
            key: LEFT,
            frames: this.anims.generateFrameNumbers(PLAYER, { start: 3, end: 5 }),
            frameRate: 13,
            repeat: -1
        })

        this.anims.create({
            key: RIGHT,
            frames: this.anims.generateFrameNumbers(PLAYER, { start: 6, end: 8 }),
            frameRate: 13,
            repeat: -1
        })

        this.anims.create({
            key: UP,
            frames: this.anims.generateFrameNumbers(PLAYER, { start: 9, end: 11 }),
            frameRate: 13,
            repeat: -1
        })

        this.anims.create({
            key: DOWN,
            frames: this.anims.generateFrameNumbers(PLAYER, { start: 0, end: 2 }),
            frameRate: 13,
            repeat: -1
        })
    }
}

export default RoomScene
