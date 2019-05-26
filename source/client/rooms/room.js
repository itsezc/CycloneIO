// @flow

import Phaser, { Scene, GameObjects } from 'phaser'

const { GameObject } = GameObjects

import SocketIO from 'socket.io-client'

import Config from '../../../config.json'

import RoomCamera from './camera'
import RoomTileMap from './tiles/map'
import RoomFurniture from './furniture'

//import '../../../web-build/phaser/plugins/webworkers.min.js'

/**
 * Room class
 * @extends {Scene}
 */
export default class Room extends Scene {

    id: number

    /**
     * @param {number} id - The room id
     */
    constructor(id: number): void {

        super({ key: 'room' })

        this.id = id

    }

    /**
     * Runs once, loads up assets like images and audio
     */
    preload() {

        //this.add.plugin(PhaserWebWorkers.plugin)
        //this.load.scenePlugin('Camera3DPlugin', 'phaser/plugins/camera3d.min.js', 'Camera3DPlugin', 'cameras3d')

        //this.load.atlas('tile', 'room/tile.png', 'room/tile.json')
        this.load.image('tile', 'room/normal_tile.png')
        this.load.image('tile_left_edge', 'room/normal_tile_left_edge.png')
        this.load.image('tile_right_edge', 'room/normal_tile_right_edge.png')
        this.load.image('tile_border', 'room/normal_tile_border.png')

        this.load.atlas('wall', 'room/wall.png', 'room/wall.json')
        this.load.image('tile_hover', 'room/tile_hover.png')
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

    /**
     * Runs once, when the scene starts
     */
    init() : void {
        this.socket = SocketIO(`${Config.server.host}:${Config.server.port}`)
        this.camera = new RoomCamera(this.cameras, 0, 0, window.innerWidth, window.innerHeight)

        this.lights.enable()
    }	

    /**
     * Runs once, after all assets in preload are loaded
     */
    create() : void {
        this.furniture = this.add.group()

        this.input.on('pointermove', pointer => {

            if (pointer.primaryDown) {
                this.camera.scroll(pointer)
            }

            else {
                this.camera.isScrolling = false
            }

        }, this)

        this.socket.emit('newRoom', this.id)

        this.registerRooms()
        this.registerFurniture()
        
        // this.moodlightPreview = this.add.graphics()
        // this.moodlightPreview.fillStyle(0x1844bd, 1)
        // this.moodlightPreview.fillRect(0, 0, 50, 60);
        // this.moodlightPreview.setBlendMode(Phaser.BlendModes.SCREEN)
        // this.moodlightPreview.setDepth(4)

        // Zoom
        // this.camera.setZoom(0.5) // Zoom out (0.5). For render issues disable antialiasing

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

    /**
     * Runs once per frame for the duration of the scene
     */
    update(): void {
        // this.camera3d.transformChildren(this.transform);
    }

    /**
     * Registers rooms events
     */
    registerRooms(): void {
        this.socket.on('newRoom', map => {
            this.addTileMap(map)
        })
    }

    /**
     * Registers furniture events
     */
    registerFurniture(): void {
        this.socket.on('newFurniture', furniture => {
            //this.addFurniture(0, 0, 0, furniture)
        })

        // Rooms[] => Items[RoomID]
        // roomFurniture[]
        // forEach (roomFurniture[]) => drawFurniture()
    }

    /**
     * Adds a new tilemap
     * @param {JSON} map - The room map
     */
    addTileMap(map: JSON): void {
        this.tileMap = new RoomTileMap(this, map)
    }

    /**
     * Adds a new furniture
     * @param {number} x - The x coordinate of the furniture
     * @param {number} y - The y coordinate of the furniture
     * @param {number} z - The z coordinate of the furniture
     * @param {string} texture - The furniture texture
     */
    addFurniture(x: number, y: number, z: number, texture: string): void {

        // Testing
        var furnitureLayer = this.add.group()
        
        this.load.setPath(`furniture/${texture}/`)
        this.load.atlas({ key: texture, textureURL: texture.concat('.png'), atlasURL: texture.concat('.json') })
        this.load.start()

        this.load.once('complete', () => {
            
            var furnitureTexture = this.textures.get(texture)

            var frameNames = furnitureTexture.getFrameNames()
            
            var frame1 = frameNames[5]
            var frame2 = frameNames[8]

            var totalFrames = []
            
            var defaultFrame = frameNames.find(name => {
                var parts = name.split('_')

                var resolution = parts[3]
                var cronological = parts[4]
                var facing = parts[5]

                return resolution == 64 && cronological === 'a' && facing == 2
            })   

            console.log(defaultFrame)

            // x = group position
            // 1st object x = 0 
            // 2nd object 0 - 10
            furnitureLayer.createMultiple({ key: texture, frame: [defaultFrame], setXY: { x: x - 1, y: y - 36, stepX: -10, stepY: 27 } } )
            furnitureLayer.setDepth(3, 1) // 
    
            // for (var i = 0; i < frames.length; i++)
            // {
            //     furnitureLayer.createMultiple({ key: texture, frame: [frames[5], frames[8]] })
            //     furnitureLayer.setDepth(0, 1)
            //     // var x = Phaser.Math.Between(50, 200)
            //     // var y = Phaser.Math.Between(50, 100)

            //     // Get layers from FurniData
            //     // let validFurni = [8, 5] 
            //     // console.log(i)

            //    

            //     // if(validFurni.includes(i)) {
            //     //     this.add.image(0, -35, texture, frames[i]).setDepth(i)
            //     // }
            // }
            //furnitureLayer.createMultiple({ key: texture, frame: [0, 1, 3, 4] })
            //this.add.sprite(x, y - 100, texture)
        })
        //this.furniture.add(new RoomFurniture(this, x, y, z, texture, 2))
    }

    /**
     * The double click event
     * @param {GameObject} object - The object to bind to
     * @param {function} callback - The callback function
     * @param {any} args - The extra arguments
     */
    onDoubleClick(object: GameObject, callback: function, ...args: any): any {

        object.on('pointerdown', (pointer) => {

            if (pointer.downTime - this.clickTime < 500) {
                if (pointer.primaryDown) {
                    callback(...args)
                }
            }

            this.clickTime = pointer.downTime
        })
    }
}
