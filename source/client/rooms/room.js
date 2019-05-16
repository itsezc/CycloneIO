import RoomCamera from './camera'
import RoomTile from './tile'
import RoomFurniture from './furniture'

//import '../../../web-build/phaser/plugins/webworkers.min.js'

export default class Room extends Phaser.Scene {
    constructor(id) {
        super({
            key: 'room'
        })

        this.id = id

    }

    preload() {
        this.load.setPath('web-build/')

        //this.add.plugin(PhaserWebWorkers.plugin)
        this.load.scenePlugin('Camera3DPlugin', 'phaser/plugins/camera3d.min.js', 'Camera3DPlugin', 'cameras3d')

        //this.load.atlas('tile', 'room/tile.png', 'room/tile.json')
        this.load.image('tile', 'room/normal_tile.png')
        this.load.image('tile_left_edge', 'room/normal_tile_left_edge.png')
        this.load.image('tile_right_edge', 'room/normal_tile_right_edge.png')
        this.load.image('tile_border', 'room/normal_tile_border.png')

        this.load.atlas('wall', 'room/wall.png', 'room/wall.json')
        this.load.svg('tile_hover', 'room/tile_hover.svg')
        this.load.image('wall_right', 'room/wall_right.png')
        this.load.image('wall_left', 'room/wall_left.png')
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
        this.camera = new RoomCamera(this.cameras, 0, 0, window.innerWidth, window.innerHeight)

        //this.lights.enable()
    }

    create() {
        this.tiles = this.add.group()
        this.furniture = this.add.group()

        this.input.on('pointermove', pointer => {

            if (pointer.primaryDown) {
                this.camera.scroll(pointer)
            }

            else {
                this.camera.isScrolling = false
            }

        }, this)

        this.game.socket.emit('newRoom', this.id)

        this.registerRooms()
        this.registerFurniture()
        
        // this.moodlightPreview = this.add.graphics()
        // this.moodlightPreview.fillStyle(0x1844bd, 1)
        // this.moodlightPreview.fillRect(0, 0, 50, 60);
        // this.moodlightPreview.setBlendMode(Phaser.BlendModes.SCREEN)
        // this.moodlightPreview.setDepth(4)

        // Zoom
        // this.camera.setZoom(4) // Zoom out (0.5). For render issues disable antialiasing

        // Room Background Color
        // this.camera.backgroundColor.setTo(0,255,255)

        // Camera  Shake
        // this.camera.shake(2000)

        // Room up side down
        // this.camera.setAngle(180)

        // this.soundSample = this.sound.add('credits')
        // this.soundSample.play()

        // this.camera3d = this.cameras3d.add(100).setPosition(0, 0, 200);
        // this.transform = new Phaser.Math.Matrix4().rotateY(-0.01)
    }

    update() {
        // this.camera3d.transformChildren(this.transform);
    }

    registerRooms() {
        this.game.socket.on('newRoom', room => {
            this.generate(room)
        })
    }

    registerFurniture() {
        this.game.socket.on('newFurniture', furniture => {
            this.addFurniture(0, 1, 0, furniture)
        })

        // Rooms[] => Items[RoomID]
        // roomFurniture[]
        // forEach (roomFurniture[]) => drawFurniture()
    }

    generate(room) {
        var map = room.model.map

        for (var i = 0; i < map.length; i++) {
            
            for (var j = 0; j < map[i].length; j++) {

                var x = j * 32
                var y = i * 32
                
                var isometricCoordinates = this.cartesianToIsometric(new Phaser.Geom.Point(x, y))

                this.addTile(isometricCoordinates.x, isometricCoordinates.y)

            }
        }
        // room.model.map.forEach((squares, row) => {

        //     squares.forEach((square, index) => {

        //         var x = row * 32 + index * 32
        //         var y = (row * 32 - index * 32) / 2
        //         var z = square[1] * 32 || 0
        //         var depth = row - index

        //         this.addTile(x, y, z, depth)

        //     })
        // })
    }

    addTile(x, y, z) {
        this.tiles.add(new RoomTile(this, x, y))
    }

    addFurniture(x, y, z, texture) {

        var isometricCoordinates = this.cartesianToIsometric(new Phaser.Geom.Point(x * 32, y * 32))

        this.furniture.add(new RoomFurniture(this, isometricCoordinates.x, isometricCoordinates.y - 25, z, texture))

    }

    cartesianToIsometric(cartesianCoordinates){
        var isometricCoordinates = new Phaser.Geom.Point()
    
        isometricCoordinates.x = cartesianCoordinates.x - cartesianCoordinates.y
        isometricCoordinates.y = (cartesianCoordinates.x + cartesianCoordinates.y) / 2

        return isometricCoordinates
    }

    isometricToCartesian(isometricCoordinates){
        var cartesianCoordinates = new Phaser.Geom.Point()

        cartesianCoordinates.x = (isometricCoordinates.y * 2 + isometricCoordinates.x) / 2;
        cartesianCoordinates.y= (isometricCoordinates.y * 2 - isometricCoordinates.x) / 2;

        return cartesianCoordinates
    }

    onDoubleClick(object, callback, ...args) {

        object.on('pointerdown', (pointer) => {

            if (pointer.downTime - this.tapTime < 500) {

                if (pointer.primaryDown){
                    callback(...args)
                }
                
            }

            this.tapTime = pointer.downTime
            
        })

    }
}
