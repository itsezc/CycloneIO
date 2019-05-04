import Config from '../../../config.json'

import Room from './room'
import RoomPlayer from './player'

//import '../../../web-build/phaser/plugins/webworkers.min.js'

export default class RoomScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'room'
        })
    }

    preload() {
        this.load.path = 'web-build/'

        //this.add.plugin(PhaserWebWorkers.plugin)
        this.load.scenePlugin('Camera3DPlugin', 'phaser/plugins/camera3d.min.js', 'Camera3DPlugin', 'cameras3d')

        this.load.svg('tile', 'room/tile.svg')
        this.load.svg('tile_hover', 'room/tile_hover.svg')
        this.load.svg('wall_left', 'room/wall_left.svg')
        this.load.image('wall_right', 'room/wall_right.png')
        this.load.svg('stair_top', 'room/stair_top.svg')
        this.load.svg('stair_right', 'room/stair_right.svg')

        this.load.audio('credits', 'audio/credits.mp3')
        this.load.audio('chat', 'audio/chat.mp3')
        this.load.audio('message', 'audio/message.mp3')
        this.load.audio('report', 'audio/report.mp3')
        this.load.audio('achievement', 'audio/achievement.mp3')
        this.load.audio('respect', 'audio/respect.mp3')
    }

    init() {
        //this.lights.enable()
        this.camera = this.cameras.main
        this.room = new Room(this, 0)

        this.camera.centerOn(this.camera.midPoint.x / window.innerWidth, this.camera.midPoint.y / window.innerHeight)

        this.input.on('pointermove', pointer => {

            if (pointer.primaryDown) {
                this.scrollCamera(this.camera, pointer)
            }
			
        }, this)

        this.scale.on('resize', gameSize => {

            this.resizeCamera(gameSize.width, gameSize.height)

        }, this)
    }

    create() {
        this.room.create()

        // this.moodlightPreview = this.add.graphics()
        // this.moodlightPreview.fillStyle(0x1844bd, 1)
        // this.moodlightPreview.fillRect(0, 0, 50, 60);
        // this.moodlightPreview.setBlendMode(Phaser.BlendModes.SCREEN)
        // this.moodlightPreview.setDepth(4)

        // Zoom
        // this.camera.setZoom(10)

        // Room Background Color
        //this.camera.backgroundColor.setTo(0,255,255)

        // Camera Shake
        //this.camera.shake(2000)

        // Room up side down
        //this.camera.setAngle(180)

        // this.soundSample = this.sound.add('credits')
        // this.soundSample.play()

        // this.camera3d = this.cameras3d.add(100).setPosition(0, 0, 200);
        // this.transform = new Phaser.Math.Matrix4().rotateY(-0.01)
    }

    update() {
        // this.camera3d.transformChildren(this.transform);
    }

    scrollCamera(camera, pointer) {
        this.camera.scrollX += pointer.downX - pointer.x
        pointer.downX = pointer.x
        this.camera.scrollY += pointer.downY - pointer.y
        pointer.downY = pointer.y
    }

    resizeCamera(width, height) {
        this.cameras.resize(width, height)
    }
}
