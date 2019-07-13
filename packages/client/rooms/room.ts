import Phaser from 'phaser'

import Vector from '../../common/types/rooms/vector'
import SocketIO from 'socket.io-client'

import Config, { server } from '../../../config.json'

const { host, port } = server

import RoomCamera from './camera'
import RoomSprite from './sprite'
import FurnitureSprite from '../furniture/sprite'

import FurnitureData from '../furniture/data'
import Furniture from '../furniture/furniture'

import Path from 'path'

import Pathfinder, { DiagonalMovement } from 'pathfinding'
import { generateBlendMode } from '../core/blendMode';
import RoomAvatar from '../avatar/avatar'

import Imager from '../avatar/imager'

import TileGenerator from '../generators/tile'
import FPSMeter from 'fpsmeter'
import Tile from '../generators/tile';

/**
* Room class
 * @extends {Scene}
*/
export default class Room extends Phaser.Scene {
    private readonly id: number

    private _socket!: SocketIOClient.Socket
    private _camera!: RoomCamera
    // private tileMap!: RoomTileMap
    // private item!: RoomItem

    private _clickTime!: number

    public avatars!: { [id: string]: RoomAvatar }

    public avatarIsWalking: boolean
    public avatarIsMoving: boolean = false
    public avatarRotation: number

    public destination: { x: number, y: number }
    public tileFrom: { x: number, y: number }

    public finder: Pathfinder.AStarFinder
    public map: number[][]
    public roomPlayer!: RoomAvatar

    public avatarId!: number
    public path!: any
    public pathNextValue!: any

    private currentFPS: Number

    public players: { [id: string]: RoomAvatar }

    private furnitures!: FurnitureSprite[]

    public avatarImager: Imager
    /*
        private map!: RoomMap */

    /**
     * @param {number} id - The room id
     */
    constructor(id: number) {
        super({ key: 'room' })
        this.id = id

        this.avatarImager = new Imager()
    }

    /**
     * Runs once, loads up assets like images and audio
     */
    preload() {
        //this.add.plugin(PhaserWebWorkers.plugin)
        //this.load.scenePlugin('Camera3DPlugin', 'phaser/plugins/camera3d.min.js', 'Camera3DPlugin', 'cameras3d')

        let Tile = new TileGenerator('tile', {
            sprite: {
                width: 65,
                height: 40
            }
        })
        this.textures.addBase64('tile', Tile.generate())
        this.load.image('tile_hover', 'room/tile_hover.png')

        this.load.image('door', 'room/door.png')
        this.load.image('door_floor', 'room/door_floor.png')

        this.load.image('wall_l', 'room/wall_l.png')
        this.load.image('wall_r', 'room/wall_r.png')

        this.load.image('wall_placeholder', 'furniture/wall_placeholder.png')

        this.load.atlas('wlk_0', 'avatar_old/wlk/wlk_0.png', 'avatar_old/wlk/wlk_0.json')
        this.load.atlas('wlk_1', 'avatar_old/wlk/wlk_1.png', 'avatar_old/wlk/wlk_1.json')
        this.load.atlas('wlk_2', 'avatar_old/wlk/wlk_2.png', 'avatar_old/wlk/wlk_2.json')
        this.load.atlas('wlk_3', 'avatar_old/wlk/wlk_3.png', 'avatar_old/wlk/wlk_3.json')
        this.load.atlas('wlk_4', 'avatar_old/wlk/wlk_4.png', 'avatar_old/wlk/wlk_4.json')
        this.load.atlas('wlk_5', 'avatar_old/wlk/wlk_5.png', 'avatar_old/wlk/wlk_5.json')
        this.load.atlas('wlk_6', 'avatar_old/wlk/wlk_6.png', 'avatar_old/wlk/wlk_6.json')
        this.load.atlas('wlk_7', 'avatar_old/wlk/wlk_7.png', 'avatar_old/wlk/wlk_7.json')

        this.load.audio('credits', 'audio/credits.mp3')
        this.load.audio('chat', 'audio/chat.mp3')
        this.load.audio('message', 'audio/message.mp3')
        this.load.audio('report', 'audio/report.mp3')
        this.load.audio('achievement', 'audio/achievement.mp3')
        this.load.audio('respect', 'audio/respect.mp3')

        // this.load.image('room_background', 'https://i.imgur.com/4co7hEz.png')
    }

    /**
     * Runs once, when the scene starts
     */
    public init(): void {
        this._socket = SocketIO(`${host}:${port}`)
        this._camera = new RoomCamera(this.cameras, { x: 0, y: 0 }, window.innerWidth, window.innerHeight)

        // this.lights.enable()
    }

    /**
     * Runs once, after all assets in preload are loaded
     */
    public create(): void {

        const renderer = this.game.renderer

        generateBlendMode(renderer)

        this._camera.create()

        this.registerInputEvents()

        this.registerScaleEvents()

        const room: FurnitureData.IRoom = {
            door: [0, 3],
            heightmap: [
                '0000000',
                '0000000',
                '0000000',
                '0000000',
                '0000000',
                '0000x00'
            ],
            furnitures: [
                {
                    name: 'CF_50_goldbar',
                    roomX: 0,
                    roomY: 1,
                    roomZ: 0
                },
                {
                    name: 'throne',
                    roomX: 0,
                    roomY: 4,
                    roomZ: 0,
                    direction: 2
                },
                //{
                //    name: 'diamond_dragon',
                //    roomX: 2,
                //    roomY: 3,
                //    direction: 3,
                //    animation: 2
                //},
                {
                    name: 'party_tube_lava',
                    roomX: 4,
                    roomY: 0,
                    roomZ: 0,
                    direction: 0,
                    animation: 0
                },
                // {
                //     name: 'ads_cllava2',
                //     roomX: 2,
                //     roomY: 0,
                //     direction: 0
                // },
                {
                    name: 'urban_lamp',
                    roomX: 2,
                    roomY: 0,
                    roomZ: 0,
                    direction: 4,
                    animation: 1
                },
                // {
                //     name: 'diamond_dragon',
                //     roomX: 4,
                //     roomY: 3,
                //     direction: 2,
                //     animation: 2
                // },
                //{
                //    name: 'ads_cllava2',
                //    roomX: 0,
                //    roomY: 6,
                //    direction: 2,
                //    animation: 0
                //},
                {
                    name: 'party_neon3',
                    roomX: 3,
                    roomY: 0,
                    roomZ: 5,
                    type: FurnitureData.IFurnitureType.WALL,
                    animation: 1
                },
                {
                    name: 'es_tile',
                    roomX: 0,
                    roomY: 2,
                    roomZ: 0,
                    animation: 0
                },
                {
                    name: 'holo_nelly',
                    roomX: 1,
                    roomY: 2,
                    roomZ: 0,
                    animation: 1
                },
                {
                    name: 'bb_counter',
                    roomX: 2,
                    roomY: 2,
                    roomZ: 0,
                    animation: 0
                },
                {
                    name: 'bb_score_g',
                    roomX: 3,
                    roomY: 2,
                    roomZ: 0,
                    animation: 0
                },
                {
                    name: 'bb_patch1',
                    roomX: 4,
                    roomY: 2,
                    roomZ: 0,
                    animation: 6
                },
                {
                    name: 'bb_patch1',
                    roomX: 4,
                    roomY: 3,
                    roomZ: 0,
                    animation: 7
                },
                {
                    name: 'bb_patch1',
                    roomX: 4,
                    roomY: 4,
                    roomZ: 0,
                    animation: 8
                },
                {
                    name: 'hrella_poster_1',
                    roomX: 6.25,
                    roomY: 0,
                    roomZ: 2.75,
                    type: FurnitureData.IFurnitureType.WALL
                }
            ]
        }

        //        this.add.image(0, 0, 'room_background').setDepth(2)

        var roomSprite = new RoomSprite(this, room.heightmap, room.door)

        this.add.existing(roomSprite)

        room.furnitures = this.orderFurnituresByType(room.furnitures)

        room.furnitures.forEach((furnitureRoomData) => {
            if (!this.isValidCoordinateForFurniture(furnitureRoomData.roomX, furnitureRoomData.roomY, room.heightmap, furnitureRoomData.type)) {
                console.warn('Invalid coordinates for furniture: ', furnitureRoomData.name)

                return
            }

            if (furnitureRoomData.type === FurnitureData.IFurnitureType.WALL) {
                furnitureRoomData.direction = this.calculateWallDirection(furnitureRoomData.roomX, furnitureRoomData.roomY)
            }

            this.load.setPath(Path.join('furniture', furnitureRoomData.name))

            this.load.atlas(furnitureRoomData.name, furnitureRoomData.name.concat('.png'), furnitureRoomData.name.concat('_spritesheet.json'))

            this.load.json(furnitureRoomData.name.concat('_data'), furnitureRoomData.name.concat('.json'))

            this.load.start()

            this.load.once('complete', () => {
                //console.log(furnitureRoomData.name, 'Direction [', furnitureRoomData.direction || 0, '] Animation [', furnitureRoomData.animation, ']')
                //console.log(furnitureRoomData)

                var furnitureData = this.cache.json.get(furnitureRoomData.name.concat('_data'))

                var furniture = new Furniture(this, furnitureData, furnitureRoomData.type)

                var furnitureSprite = new FurnitureSprite(this, furniture)

                if (furnitureRoomData.animation !== undefined) {
                    console.log('Animated Furni: ', furnitureRoomData.name, furnitureRoomData.animation)
                    furnitureSprite.animateAndStart(furnitureRoomData.animation)
                } else {
                    furnitureSprite.start()
                }

                if (furnitureRoomData.color) {
                    furnitureSprite.setColor(furnitureData.color)
                }

                furnitureSprite.setDirection(furnitureRoomData.direction || 0)

                roomSprite.addFurnitureSprite(furnitureSprite, furnitureRoomData.roomX, furnitureRoomData.roomY, furnitureRoomData.roomZ)
            })

            roomSprite.start()

            this.add.existing(roomSprite)

            this.camera.setZoom(4)

            /* //roomSprite => 1 instance of a furniture
            this.add.existing(roomSprite)

            var furniture = new Furniture(this, furnitureData)

            let furnitureSprite = new FurnitureSprite(this, furniture)

            if (furnitureRoomData.animation)
            {
                furnitureSprite.animateAndStart(furnitureRoomData.animation);
            }

            if (furnitureRoomData.color)
            {
                furnitureSprite.setColor(furnitureRoomData.color);
            }

            if (furnitureRoomData.direction)
            {
                furnitureSprite.setDirection(furnitureRoomData.direction);
            }

            roomSprite.addFurnitureSprite(furnitureSprite, furnitureRoomData.roomX, furnitureRoomData.roomY);
 */
        })

        this._camera.setZoom(1)

        this._socket.emit('requestRoom', 0)

        this._socket.on('connect', () => {
            console.log(`Server connected on ${window.location.hostname}`);
            this._socket.emit('requestRoom', 0)
        })

        let genRandom = (min: number, max: number) =>// min and max included
        {
            return Math.floor(Math.random() * (max - min + 1) + min)
        }

        // /*         this._socket.on('joinRoom', (roomId: number, playerId: number) => {

        //             console.log('Joined', roomId, playerId)

        // /*             var avatarX = this.getScreenX(0, 0)
        //             var avatarY = this.getScreenY(0, genRandom(0, 5))

        //             this.avatars[playerId] = this.physics.add.sprite(avatarX, avatarY - 84, 'avatar').setDepth(3).setOrigin(0, 0)
        //             this.avatar = this.avatars[playerId] */
        //         }) */

        //this._socket.on('joinRoom', (playerId: any, playerX: any, playerY: any) => {
            this.roomPlayer = new RoomAvatar(this, 0, 0, 0, 0)
            this.roomPlayer.x = this.roomPlayer.RenderPos.x
            this.roomPlayer.y = this.roomPlayer.RenderPos.y
        //})

        this._socket.on('playerMoved', (playerId: any, oldPlayerCoordinates: any, path: any, destination: any) => {

            if (this.roomPlayer) {
                this.roomPlayer.moveToDestination(oldPlayerCoordinates, path, destination)
            }
        })

        // this._socket.on('currentPlayers', (players: any) => {
        //     Object.keys(players).forEach((playerId: any) => {
        //         var player = players[playerId]
        //         this.roomPlayer.addPlayerToRoom(playerId, player.x, player.y);
        //     })
        // })

        this._socket.on('playerDisconnected', (playerId: any) => {
            this.roomPlayer.removeFromRoom();
        });


        /*         this._socket.on('currentPlayers', (players: any) => {
                    Object.keys(players).forEach((playerId) => {
                        var player = players[playerId];
                        this.roomPlayer.addPlayerToRoom(player);
                      });
                  
                }) */




        /* for (let y = 0;y < map.length;y++)
        {
            for (let x = 0;x < map[y].length;x++)
            {
/*                 // simplified version
                var isometricCoords = this.tileToPixels(x, y)
                var isometricCoords = this.coordsToIsometric(x, y)

                var tile = this.add.image(isometricCoords.x, isometricCoords.y, 'tile')
                tiles.add(tile)

                tile.setInteractive({ pixelPerfect: true })

                tile.on('pointerdown', (pointer: Phaser.Input.Pointer) =>
                {

                })

                // var topTileSurface = new Phaser.Geom.Polygon(
                //     [
                //         new Phaser.Geom.Point(0, 0),
                //         new Phaser.Geom.Point(tileWidth / 2, -tileWidth / 4),
                //         new Phaser.Geom.Point(tileWidth, 0),
                //         new Phaser.Geom.Point(tileWidth / 2, tileWidth / 4)
                //     ])
                // tile = this.add.graphics()

                // tile.fillStyle(0x989865)
                // tile.fillPoints(topTileSurface.points)

                // tile.lineStyle(0.5, 0x8E8E5E)
                // tile.strokePoints(topTileSurface.points)

                // var leftTileThickness = new Phaser.Geom.Polygon(
                //     [
                //         new Phaser.Geom.Point(0, thickness),
                //         new Phaser.Geom.Point(0, 0),
                //         new Phaser.Geom.Point(tileWidth / 2, tileWidth / 4),
                //         new Phaser.Geom.Point(tileWidth / 2, tileWidth / 4 + thickness)
                //     ]
                // )

                // tile.fillStyle(0x838357)
                // tile.fillPoints(leftTileThickness.points)

                // tile.lineStyle(0.5, 0x7A7A51)
                // tile.strokePoints(leftTileThickness.points)

                // var bottomTileThickness = new Phaser.Geom.Polygon(
                //     [
                //         new Phaser.Geom.Point(tileWidth / 2, tileWidth / 4 + thickness),
                //         new Phaser.Geom.Point(tileWidth / 2, tileWidth / 4),
                //         new Phaser.Geom.Point(tileWidth, 0),
                //         new Phaser.Geom.Point(tileWidth, thickness)
                //     ],
                // )

                // tile.fillStyle(0x6F6F49)
                // tile.fillPoints(bottomTileThickness.points)

                // tile.lineStyle(0.5, 0x676744)
                // tile.strokePoints(bottomTileThickness.points)

                // tile.setInteractive(topTileSurface, Phaser.Geom.Polygon.Contains)

                /*                 var tileHover: Phaser.GameObjects.Image

                                tile.on('pointerover', () => {
                                    tileHover = this.add.image(isometricX, isometricY, 'tile_hover')
                                    tileHover.depth = 2
                                    console.log(tile.x)
                                })

                                tile.on('pointerout', () => {
                                    tileHover.destroy()
                                })
                 
                // tile.setPosition(isometricX, isometricY)
            }
        } */

        // Zoom out (0.55). max: 10
        //this.camera.setZoom(0.55)

        /* this.registerInputEvents()

        this.registerScaleEvents()

        this.emitRoom()

        this.registerRoomsEvents()

        this.registerItemsEvents()

        // this.moodlightPreview = this.add.graphics()
        // this.moodlightPreview.fillStyle(0x1844bd, 1)
        // this.moodlightPreview.fillRect(0, 0, 50, 60);
        // this.moodlightPreview.setBlendMode(Phaser.BlendModes.SCREEN)
        // this.moodlightPreview.setDepth(4)

        // Zoom
        this.camera.setZoom(1.5) // Zoom out (0.5). For render issues disable antialiasing

        // Room Background Color
        this.camera.backgroundColor.setTo(0,255,255) */

        // Camera Shake
        // this.camera.shake(2000)

        // Room up side down
        //this.camera.setAngle(180)

        // this.soundSample = this.sound.add('credits')
        // this.soundSample.play()

        // this.camera3d = this.cameras3d.add(100).setPosition(0, 0, 200);
        // this.transform = new Phaser.Math.Matrix4().rotateY(-0.01)

        // this.add.text(100, 100, `FPS: ${this.currentFPS || 'undefined'}`, { color: '#00ff00' })
    }

    private orderFurnituresByType(furnitures: FurnitureData.IFurniture[]): FurnitureData.IFurniture[] {
        return furnitures.sort((a: FurnitureData.IFurniture, b: FurnitureData.IFurniture) => {
            if (a.type === FurnitureData.IFurnitureType.WALL) return -1
            else return 1
        })
    }

    private isValidCoordinateForFurniture(x: number, y: number, heightmap: string[], type: FurnitureData.IFurnitureType = FurnitureData.IFurnitureType.FLOOR) {
        if (type === FurnitureData.IFurnitureType.FLOOR) {
            const height = this.getHeightByCoords(x, y, heightmap)

            return height != null && height != 'x'
        } else if (type === FurnitureData.IFurnitureType.WALL) {
            return this.isValidWallPosition(x, y, heightmap)
        }
    }

    private getHeightByCoords(x: number, y: number, heightmap: string[]) {
        const row = heightmap[y];

        if (row == null)
            return null

        const points = row.split('')
        const point = points[x]

        if (point == null) 
            return null

        
        return point
    }

    private isValidWallPosition(x: number, y: number, heightmap: string[]) {
        const realX = Math.floor(x)
        const realY = Math.floor(y)

        const height = this.getHeightByCoords(realX, realY, heightmap)

        if (height == 'x')
            return false

        if((x === 0 && y === 0) || (x > 0 && y > 0))
            return false
        else 
            return true
    }

    private calculateWallDirection(x: number, y: number) {
        return x > 0 ? 4 : 0
    }

    /**
     * Runs once per frame for the duration of the scene
     * @override
     */
    public update(time: number, delta: number): void {
        if (this.roomPlayer) {
            this.roomPlayer.update(delta)
        }

        this.currentFPS = this.game.loop.actualFps
        // console.log('FPS', this.currentFPS)
    }

    public TileToScreenCoords(x: number, y: number) {
        let screenX = 0 + (1 + x - y) * 32;
        let screenY = 0 + (1 + x + y) * 16;

        return { x: screenX, y: screenY };
    }

    public TileToPixels(x: number, y: number) {
        let toX = (1 + x - y) * 32;
        let toY = (1 + x + y) * 16;

        return { x: toX, y: toY };
    }

    public mapToIsometric(mapCoordinates: any) {
        var isometricCoordinates = new Phaser.Geom.Point()
        isometricCoordinates.x = (mapCoordinates.x - mapCoordinates.y) * 32
        isometricCoordinates.y = (mapCoordinates.x + mapCoordinates.y) * 16
        return (isometricCoordinates)
    }


    public getScreenX(x: number, y: number): number {
        return (x - y) * 32
    }

    public getScreenY(x: number, y: number): number {
        return (x + y) * 16
    }

    coordsToIsometric(x: number, y: number) {
        var toX = (x - y) * 32
        var toY = (x + y) * 16

        return { x: toX, y: toY }
    }

    public registerInputEvents(): void {
        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (pointer.primaryDown) {
                this._camera.scroll(pointer)
            }

            else {
                this._camera.isScrolling = false
            }

        }, this)
    }

    public registerScaleEvents(): void {
        this.scale.on('resize', (gameSize: { width: number, height: number }) => {
            var width = gameSize.width
            var height = gameSize.height

            this.cameras.resize(width, height)

        }, this)
    }

    public emitRoom(): void {
        this._socket.emit('newRoom', this.id)
    }

    public registerRoomsEvents(): void {
        this._socket.on('newRoom', (map: any) => {
            //this.addTileMap(map)
        })
    }

    public registerItemsEvents(): void {

        /*         this.socket.on('newItem', (item: any) => {
                    this.addItem({ x: 0, y: 0, z: 0 }, item)
                }) */
    }

    /**
     * Adds a new tilemap
     * @param {Object} map - The room map
     */
    /*     public addTileMap(map: [][]): void {
            this.tileMap = new RoomTileMap(this, map)
        } */
    /*
        public addItem(coordinates: Vector, textureName: string)
        {
            this.item = new RoomItem(this, textureName, 1, 1, 1, coordinates, 0, 0)
            this.item.load()
        } */

    // /**
    //  * Adds a new furniture
    //  * @param {number} x - The x coordinate of the furniture
    //  * @param {number} y - The y coordinate of the furniture
    //  * @param {number} z - The z coordinate of the furniture
    //  * @param {string} texture - The furniture texture
    //  */
    // addFurniture(x: number, y: number, z: number, texture: string): void {

    //     // Testing
    //     // var furnitureLayer = this.add.group()

    //     // this.load.setPath(`furniture/${texture}/`)
    //     // this.load.atlas({ key: texture, textureURL: texture.concat('.png'), atlasURL: texture.concat('.json') })
    //     // this.load.start()

    //     // this.load.once('complete', () => {

    //     //     var furnitureTexture = this.textures.get(texture)

    //     //     var frameNames = furnitureTexture.getFrameNames()

    //     //     var frame1 = frameNames[5]
    //     //     var frame2 = frameNames[8]

    //     //     var totalFrames = []

    //     //     var defaultFrame = frameNames.find(name => {
    //     //         var parts = name.split('_')

    //     //         var resolution = parts[3]
    //     //         var cronological = parts[4]
    //     //         var facing = parts[5]

    //     //         return resolution == 64 && cronological === 'a' && facing == 2
    //     //     })

    //     //     console.log(defaultFrame)

    //     //     // x = group position
    //     //     // 1st object x = 0
    //     //     // 2nd object 0 - 10
    //     //     furnitureLayer.createMultiple({ key: texture, frame: [defaultFrame], setXY: { x: x - 1, y: y - 36, stepX: -10, stepY: 27 } } )
    //     //     furnitureLayer.setDepth(3, 1) //

    //     //     // for (var i = 0; i < frames.length; i++)
    //     //     // {
    //     //     //     furnitureLayer.createMultiple({ key: texture, frame: [frames[5], frames[8]] })
    //     //     //     furnitureLayer.setDepth(0, 1)
    //     //     //     // var x = Phaser.Math.Between(50, 200)
    //     //     //     // var y = Phaser.Math.Between(50, 100)

    //     //     //     // Get layers from FurniData
    //     //     //     // let validFurni = [8, 5]
    //     //     //     // console.log(i)

    //     //     //

    //     //     //     // if(validFurni.includes(i)) {
    //     //     //     //     this.add.image(0, -35, texture, frames[i]).setDepth(i)
    //     //     //     // }
    //     //     // }
    //     //     //furnitureLayer		console.log(this.map).createMultiple({ key: texture, frame: [0, 1, 3, 4] })
    //     //     //this.add.sprite(x, y - 100, texture)
    //     // })
    //     //this.furniture.add(new RoomFurniture(this, x, y, z, texture, 2))
    // }
    /* @param {Vector} cartesian - The cartesian coordinates of the sprite
     * @return {Vector} Isometric coordinates of the sprite
     */
    public cartesianToIsometric(cartesian: Vector): Vector {
        return { x: cartesian.x - cartesian.y, y: (cartesian.x + cartesian.y) / 2, z: cartesian.z }
    }

    /**
     * @param {Vector} isometric - The isometric coordinates of the sprite
     * @return {Vector} Cartesian coordinates of the sprite
     */
    public isometricToCartesian(isometric: Vector): Vector {
        return { x: (isometric.y * 2 + isometric.x) / 2, y: (isometric.y * 2 - isometric.x) / 2, z: isometric.z }
    }

    /**
     * @param {Vector} coordinates - The coordinates of the sprite
     * @return {Vector} Cartesian coordinates of the sprite
     */
    public coordsToCartesian(coordinates: Vector): Vector {
        return { x: coordinates.x * 32, y: coordinates.y * 32, z: coordinates.z }
    }

    /**
     * @param {Vector} cartesian - The cartesian coordinates of the sprites
     * @return {Vector} Coordinates of the sprite
     */
    public cartesianToCoords(cartesian: Vector): Vector {
        return { x: Math.floor(cartesian.x / 32), y: Math.floor(cartesian.y / 32), z: cartesian.z }
    }

    /**
     * The double click event
     * @param {GameObject} object - The object to bind to
     * @param {function} callback - The callback function
     * @param {any} args - The extra arguments
     */
    public onDoubleClick(object: Phaser.GameObjects.GameObject, callback: (...n: any) => any, ...args: any): void {

        object.on('pointerdown', (pointer: Phaser.Input.Pointer) => {

            if (pointer.downTime - this._clickTime < 500) {
                if (pointer.primaryDown) {
                    callback(...args)
                }
            }

            this._clickTime = pointer.downTime
        })
    }

    public get socket(): SocketIOClient.Socket {
        return this._socket
    }

    public get camera(): RoomCamera {
        return this._camera
    }

    public convertOldToNewHeightMap(heightMap: string[]) {
        let newHeightMap: any = []
        heightMap.forEach(row => newHeightMap.push(row.split('')))
        return newHeightMap[0].map((column: any, index: any) => newHeightMap.map((row: any) => Number(row[index].replace('0', 1).replace('x', 0))).reverse())
    }    
}
