import Phaser from 'phaser'

import Vector from '../../common/types/rooms/vector'
import SocketIO from 'socket.io-client'

import Config, { server } from '../../../config.json'

const { host, port } = server

import { Engine } from '../games/game'

import RoomCamera from './camera'
import RoomSprite from './sprite'
import FurnitureSprite from '../furniture/sprite'

import FurnitureData from '../furniture/data'
import Furniture from '../furniture/furniture'

import Path from 'path'

import Pathfinder, { DiagonalMovement } from 'pathfinding'
import { generateBlendMode } from '../core/blendMode';
import RoomAvatar from '../avatar/avatar'

import TileGenerator from '../generators/tile'
// import FPSMeter from 'fpsmeter'
import Tile from '../generators/tile';

type PlayerInfo = {
    socketId: string;
    avatarData: any;
    avatar?: RoomAvatar;
}

/**
* Room class
 * @extends {Scene}
*/
export default class Room extends Phaser.Scene {
    private readonly roomData: any

    public readonly engine: Engine

    // private _socket!: SocketIOClient.Socket
    private _camera!: RoomCamera
    // private tileMap!: RoomTileMap
    // private item!: RoomItem

    private assetsLoaded: boolean

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

    public players: PlayerInfo[]
    public playerQueue: PlayerInfo[]

    public moodlightPreview: any

    private furnitures!: FurnitureSprite[]
    /*
        private map!: RoomMap */

    /**
     * @param {number} id - The room id
     */
    constructor(roomData: any, engine: Engine) {
        super({ key: 'room' })

        this.roomData = roomData

        this.engine = engine

        this.assetsLoaded = false

        this.players = []

        this.playerQueue = []
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

        this.load.image('stairs_top_left', 'room/stairs_top_left.png')
        this.load.image('stairs_top_right', 'room/stairs_top_right.png')
        this.load.image('stairs_left', 'room/stairs_left.png')
        this.load.image('stairs_right', 'room/stairs_right.png')
        this.load.image('stairs_bottom_right', 'room/stairs_bottom_right.png')
        this.load.image('stairs_bottom_left', 'room/stairs_bottom_left.png')
        this.load.image('stairs_center', 'room/stairs_center.png')

        this.load.image('avatar_shadow', 'avatar/shadow.png')

        this.load.image('wall_l', 'room/wall_l.png')
        this.load.image('wall_r', 'room/wall_r.png')

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
        // this._socket = SocketIO(`${host}:${port}`)
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
            heightmap:
            [
                [0, 0, 1, 2, 3, 0, 0, 1, 3],
                [0, 0, 0, 0, 0],
                [-1],
                [0, 0],
                [0, 1],
                [1, 2, 3, 4, 5, 6],
                [4, 3, 2, 1],
                [-1],
                [0, 0, 0],
                [0, 1, 0],
                [0, 0, 0]
            ],
            furnitures: [
                // {
                //     name: 'CF_50_goldbar',
                //     roomX: 0,
                //     roomY: 0,
                //     roomZ: 1
                // },
                /*
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
                //     name: 'ads_calip_pool',
                //     roomX: 6,
                //     roomY: 3,
                //     roomZ: 0,
                //     animation: 0
                // },
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
                //     roomX: 6,
                //     roomY: 3,
                //     roomZ: 0,
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
                // {
                //     name: 'party_neon3',
                //     roomX: 3,
                //     roomY: 0,
                //     roomZ: 5,
                //     type: FurnitureData.IFurnitureType.WALL,
                //     animation: 1
                // },
                {
                    name: 'es_tile',
                    roomX: 0,
                    roomY: 2,
                    roomZ: 0,
                    animation: 0
                },
                // {
                //     name: 'holo_nelly',
                //     roomX: 1,
                //     roomY: 2,
                //     roomZ: 0,
                //     animation: 1
                // },
                // {
                //     name: 'bb_counter',
                //     roomX: 2,
                //     roomY: 2,
                //     roomZ: 0,
                //     animation: 0
                // },
                // {
                //     name: 'bb_score_g',
                //     roomX: 3,
                //     roomY: 2,
                //     roomZ: 0,
                //     animation: 0
                // },
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
                */
                {
                    name: 'exe_icecream',
                    roomX: 1,
                    roomY: 4,
                    roomZ: 0,
                },
                {
                    name: 'edicehc',
                    roomX: 1,
                    roomY: 5,
                    roomZ: 0,
                    direction: 1
                },
                {
                    name: 'hrella_poster_1',
                    roomX: 6.25,
                    roomY: 0,
                    roomZ: 2.75,
                    type: FurnitureData.IFurnitureType.WALL
                },
                {
                    name: 'throne',
                    roomX: 0,
                    roomY: 4,
                    roomZ: 0,
                    direction: 2
                },
                {
                    name: 'edicehc',
                    roomX: 4,
                    roomY: 0,
                    roomZ: 0,
                    direction: 1
                },
                {
                    name: 'edicehc',
                    roomX: 2,
                    roomY: 4,
                    roomZ: 0,
                    direction: 1
                }
            ]
        }

        //this._camera.setZoom(4)

        //        this.add.image(0, 0, 'room_background').setDepth(2)

        var roomSprite = new RoomSprite(this, room.heightmap, room.door)

        this.add.existing(roomSprite)

        room.furnitures = this.orderFurnituresByType(room.furnitures)

        const furnituresSprites: FurnitureSprite[] = [];

        const completedFurniPromises: Promise<void>[] = [];

        room.furnitures.forEach((furnitureRoomData) => {

            completedFurniPromises.push(
                new Promise((resolve, reject) => {
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

                        const furnitureData = this.cache.json.get(furnitureRoomData.name.concat('_data'))

                        const furniture = new Furniture(this, furnitureData, furnitureRoomData.type)

                        const furnitureSprite = new FurnitureSprite(this, furniture)

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

                        // x = 0, z = 0, y = 0
                        // x = 10, z = 10, y = 0
                        //furnitureSprite.depth = 1000 * furnitureRoomData.roomX - furnitureRoomData.roomZ + 1000 * furnitureRoomData.roomY + 1000
                        furnitureSprite.depth = furnitureRoomData.roomX + furnitureRoomData.roomY + furnitureRoomData.roomZ

                        furnitureSprite.roomX = furnitureRoomData.roomX
                        furnitureSprite.roomZ = furnitureRoomData.roomZ
                        furnitureSprite.roomY = furnitureRoomData.roomY

                        furnituresSprites.push(furnitureSprite)

                        resolve();
                    })

                    roomSprite.start()
                })
            )
        })

        Promise.all(completedFurniPromises).then(()=>{
            const furnituresSorted = furnituresSprites.sort((a: FurnitureSprite,  b: FurnitureSprite) => {
                return (a.depth >= b.depth ? 1 : -1)
            })

            furnituresSorted.forEach(furni => {
                roomSprite.addFurnitureSprite(furni, furni.roomX, furni.roomY, furni.roomZ)

            })
        })

        //this._camera.setZoom(4)

        // this._socket.emit('requestRoom', 0)

        // this._socket.on('connect', () => {
        //     console.log(`Server connected on ${window.location.hostname}`);
        //     this._socket.emit('requestRoom', 0)
        // })

        let genRandom = (min: number, max: number) =>// min and max included
        {
            return Math.floor(Math.random() * (max - min + 1) + min)
        }

        //this._socket.on('joinRoom', (playerId: any, playerX: any, playerY: any) => {
            /* this.roomPlayer = new RoomAvatar(this, 2, 3, 0, 0)

            let tmpX = this.roomPlayer.RenderPos.x
            let tmpY = this.roomPlayer.RenderPos.y

            this.roomPlayer.x = tmpX
            this.roomPlayer.y = tmpY

            this.add.existing(this.roomPlayer) */
        //})

        // Zoom out (0.55). max: 10
        //this.camera.setZoom(0.55)

        // this.moodlightPreview = this.add.graphics()
        // this.moodlightPreview.fillStyle(0x1844bd, 1)
        // this.moodlightPreview.fillRect(-500, -500, 1000, 1000);
        // this.moodlightPreview.setBlendMode(Phaser.BlendModes.SCREEN)
        // this.moodlightPreview.setDepth(10)

        // Zoom
        this.camera.setZoom(1) // Zoom out (0.5). For render issues disable antialiasing

        // Room Background Color
        // this.camera.backgroundColor.setTo(0,255,255)

        // Camera Shake
        // this.camera.shake(2000)

        // Room up side down
        //this.camera.setAngle(180)

        // this.soundSample = this.sound.add('credits')
        // this.soundSample.play()

        // this.camera3d = this.cameras3d.add(100).setPosition(0, 0, 200);
        // this.transform = new Phaser.Math.Matrix4().rotateY(-0.01)

        // this.add.text(100, 100, `FPS: ${this.currentFPS || 'undefined'}`, { color: '#00ff00' })

        this.assetsLoaded = true

    }

    public removePlayer(socketId: string): void {
        let playerInfo: PlayerInfo = this.players.find(player => player.socketId === socketId)
        if(playerInfo){
            let index = this.players.indexOf(playerInfo)
            this.players.splice(index, 1)
            playerInfo.avatar.destroy()
        }
    }

    public addPlayer(playerInfo: PlayerInfo): void{
        this.playerQueue.push(playerInfo)

    }

    public addPlayers(players: PlayerInfo[]): void{
       players.forEach(player => this.playerQueue.push(player))
    }

    private orderFurnituresByType(furnitures: FurnitureData.IFurniture[]): FurnitureData.IFurniture[] {
        return furnitures.sort((a: FurnitureData.IFurniture, b: FurnitureData.IFurniture) => {
            if (a.type === FurnitureData.IFurnitureType.WALL) return -1
            else return 1
        })
    }

    private isValidCoordinateForFurniture(x: number, y: number, heightmap: Array<Array<number>>, type: FurnitureData.IFurnitureType = FurnitureData.IFurnitureType.FLOOR) {
        if (type === FurnitureData.IFurnitureType.FLOOR) {
            const height = this.getHeightByCoords(x, y, heightmap)

            return height != null && height !== 0
        } else if (type === FurnitureData.IFurnitureType.WALL) {
            return this.isValidWallPosition(x, y, heightmap)
        }
    }

    private getHeightByCoords(x: number, y: number, heightmap: Array<Array<number>>) {
        const row = heightmap[y]

        if (row == null)
            return null

        const points = row
        const point = points[x]

        if (point == null)
            return null


        return point
    }

    private isValidWallPosition(x: number, y: number, heightmap: Array<Array<number>>) {
        const realX = Math.floor(x)
        const realY = Math.floor(y)

        const height = this.getHeightByCoords(realX, realY, heightmap)

        if (height === 0)
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

        // if(this.assetsLoaded){
        //     this.playerQueue.forEach((playerInfo: PlayerInfo, index: number) => {

        //         let newPlayer = new RoomAvatar(this, playerInfo.avatarData.x, playerInfo.avatarData.y, 0, 1);
        //         newPlayer.setDepth(newPlayer.x + newPlayer.y + newPlayer.z + 2)

        //         let tmpX = newPlayer.RenderPos.x
        //         let tmpY = newPlayer.RenderPos.y

        //         newPlayer.x = tmpX
        //         newPlayer.y = tmpY

        //         playerInfo.avatar = newPlayer

        //         this.players.push(playerInfo)
        //         this.add.existing(playerInfo.avatar)
        //         this.playerQueue.splice(index, 1)

        //     })
        // }

        // this.players.forEach((roomPlayer: PlayerInfo) => {
        //     roomPlayer.avatar.update(delta)
        // })


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

    public registerItemsEvents(): void {

    }

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

    public get camera(): RoomCamera {
        return this._camera
    }

    public convertOldToNewHeightMap(heightMap: string[]) {
        let newHeightMap: any = []
        heightMap.forEach((row: any) => newHeightMap.push(row.split('')))
        return newHeightMap[0].map((column: any, index: any) => newHeightMap.map((row: any) => Number(row[index].replace('0', 1).replace('x', 0))).reverse())
    }
}
