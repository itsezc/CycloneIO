import Phaser from 'phaser'

import Vector from '../../common/types/rooms/vector'
import SocketIO from 'socket.io-client'

import Config, { server } from '../../../config.json'

const { host, port } = server

import RoomCamera from './camera'
import RoomSprite from './sprite'
import FurnitureSprite from '../furniture/sprite';

// import RoomMap from './tiles/map'

/* import RoomItem from './items/item' */
import FurnitureData from '../furniture/data'
import Furniture from '../furniture/furniture'

import Path from 'path'

import Pathfinder, { DiagonalMovement } from 'pathfinding'
import RoomPlayer from '../players/player';
import { thisTypeAnnotation } from 'babel-types';
import { generateBlendMode } from '../core/blendMode';

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

    public avatars!: { [id: string]: Phaser.Physics.Arcade.Sprite }
    public avatar!: Phaser.Physics.Arcade.Sprite
    public avatarIsWalking: boolean
    public avatarIsMoving: boolean = false
    public avatarRotation: number
    public tileDestination: { x: number, y: number }
    public finder: Pathfinder.AStarFinder
    public map: number[][]
    public roomPlayer!: RoomPlayer

    public avatarId!: number

    private furnitures!: FurnitureSprite[]
    /*
        private map!: RoomMap */

    /**
     * @param {number} id - The room id
     */
    constructor(id: number) {
        super({ key: 'room' })
        this.id = id
    }

    /**
     * Runs once, loads up assets like images and audio
     */
    preload() {
        //this.add.plugin(PhaserWebWorkers.plugin)
        //this.load.scenePlugin('Camera3DPlugin', 'phaser/plugins/camera3d.min.js', 'Camera3DPlugin', 'cameras3d')

        // this.load.atlas('present_gen1', 'test/present_gen1.png', 'test/present_gen1_spritesheet.json')
        // this.load.json('present_gen1_data', 'test/present_gen1.json')

        // this.load.atlas('ads_calip_fan', 'test/ads_calip_fan.png', 'test/ads_calip_fan_spritesheet.json')
        // this.load.json('ads_calip_fan_data', 'test/ads_calip_fan.json')

        this.load.svg('tile', 'room/tile.svg')
        this.load.image('floor_tile', 'room/floor_tile.png')
        this.load.image('tile2', 'room/tile2.png')
        this.load.image('tile_hover', 'room/tile_hover.png')

        this.load.image('wall_l', 'room/wall_l.png')
        this.load.image('wall_r', 'room/wall_r.png')

        this.load.atlas('avatar', 'avatar/avatar.png', 'avatar/avatar.json')


        this.load.image('wall_placeholder', 'furniture_new/wall_placeholder.png')

        this.load.atlas('wlk_0', 'avatar/wlk/wlk_0.png', 'avatar/wlk/wlk_0.json')
        this.load.atlas('wlk_1', 'avatar/wlk/wlk_1.png', 'avatar/wlk/wlk_1.json')
        this.load.atlas('wlk_2', 'avatar/wlk/wlk_2.png', 'avatar/wlk/wlk_2.json')
        this.load.atlas('wlk_3', 'avatar/wlk/wlk_3.png', 'avatar/wlk/wlk_3.json')
        this.load.atlas('wlk_4', 'avatar/wlk/wlk_4.png', 'avatar/wlk/wlk_4.json')
        this.load.atlas('wlk_5', 'avatar/wlk/wlk_5.png', 'avatar/wlk/wlk_5.json')
        this.load.atlas('wlk_6', 'avatar/wlk/wlk_6.png', 'avatar/wlk/wlk_6.json')
        this.load.atlas('wlk_7', 'avatar/wlk/wlk_7.png', 'avatar/wlk/wlk_7.json')
        //this.load.atlas('tile', 'room/tile.png', 'room/tile.json')
        /*      
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
        */

        this.load.audio('credits', 'audio/credits.mp3')
        this.load.audio('chat', 'audio/chat.mp3')
        this.load.audio('message', 'audio/message.mp3')
        this.load.audio('report', 'audio/report.mp3')
        this.load.audio('achievement', 'audio/achievement.mp3')
        this.load.audio('respect', 'audio/respect.mp3')

        this.load.image('room_background', 'https://i.imgur.com/4co7hEz.png')
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
            heightmap: [
                "0000000",
                "0000000",
                "0000x00",
                "0000000",
                "0000000",
                "0000000",
                "0000000"
            ],
            furnitures: [
               // {
               //     name: 'CF_50_goldbar',
               //     roomX: 0,
               //     roomY: 1
               // },
               // {
               //     name: 'throne',
               //     roomX: 0,
               //     roomY: 3,
               //     direction: 2
               // },
               // {
               //     name: 'diamond_dragon',
               //     roomX: 2,
               //     roomY: 3,
               //     direction: 3,
               //     animation: 2
               // },
                {
                    name: 'party_tube_lava',
                    roomX: 4,
                    roomY: 0,
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
                {
                    name: 'ads_cllava2',
                    roomX: 0,
                    roomY: 6,
                    direction: 2,
                    animation: 0
                },
                {
                    name: 'hrella_poster_1',
                    roomX: 0,
                    roomY: 0,
                    direction: 0
                }
            ]
        }


        /*         var frames: Phaser.Types.Animations.AnimationFrame[] = []
        
                for (var i = 1;i < this.avatar.texture.frameTotal - 1;i++)
                {
                    frames[i - 1] = this.anims.generateFrameNames('avatar')[i]
                } */
        //console.log(this.scene.anims.generateFrameNames('avatar')[0])
        this.anims.create({
            key: 'wlk_0',
            frames: this.anims.generateFrameNames('wlk_0'),
            frameRate: 12,
            repeat: -1
        })

        this.anims.create({
            key: 'wlk_1',
            frames: this.anims.generateFrameNames('wlk_1'),
            frameRate: 12,
            repeat: -1
        })

        this.anims.create({
            key: 'wlk_2',
            frames: this.anims.generateFrameNames('wlk_2'),
            frameRate: 12,
            repeat: -1
        })

        this.anims.create({
            key: 'wlk_3',
            frames: this.anims.generateFrameNames('wlk_3'),
            frameRate: 12,
            repeat: -1
        })

        this.anims.create({
            key: 'wlk_4',
            frames: this.anims.generateFrameNames('wlk_4'),
            frameRate: 12,
            repeat: -1
        })

        this.anims.create({
            key: 'wlk_5',
            frames: this.anims.generateFrameNames('wlk_5'),
            frameRate: 12,
            repeat: -1
        })

        this.anims.create({
            key: 'wlk_6',
            frames: this.anims.generateFrameNames('wlk_6'),
            frameRate: 12,
            repeat: -1
        })

        this.anims.create({
            key: 'wlk_7',
            frames: this.anims.generateFrameNames('wlk_7'),
            frameRate: 12,
            repeat: -1
        })
        //this.add(RoomSprite.furnitureContainer) <- add to scene 

        /* this.map = new RoomMap(this, [[1, 1, 1]]) */

        // var map = [[1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1],
        // [1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1]]

        //        this.add.image(0, 0, 'room_background').setDepth(2)


        // if(roomSprite)
        // {
        //     roomSprite.stop()
        // }

        // this.children.removeAll()
        // var roomContainer = new Phaser.Container();
        // roomContainer.x = Math.floor(window.innerWidth / 2);
        // roomContainer.y = Math.floor(window.innerHeight / 2);

        var roomSprite = new RoomSprite(this, room.heightmap)

        this.add.existing(roomSprite)

        room.furnitures.forEach((furnitureRoomData) => {
            this.load.setPath(Path.join('furniture_new', furnitureRoomData.name))

            this.load.atlas(furnitureRoomData.name, furnitureRoomData.name.concat('.png'), furnitureRoomData.name.concat('_spritesheet.json'))

            this.load.json(furnitureRoomData.name.concat('_data'), furnitureRoomData.name.concat('.json'))

            this.load.start()

            this.load.once('complete', () => {
                //console.log(furnitureRoomData.name, 'Direction [', furnitureRoomData.direction || 0, '] Animation [', furnitureRoomData.animation, ']')
                //console.log(furnitureRoomData)

                var furnitureData = this.cache.json.get(furnitureRoomData.name.concat('_data'))

                var furniture = new Furniture(this, furnitureData)
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

                roomSprite.addFurnitureSprite(furnitureSprite, furnitureRoomData.roomX, furnitureRoomData.roomY)
            })

            roomSprite.start()

            this.add.existing(roomSprite)

            this.camera.setZoom(4)

            // Furniture Rotation
            if (this.input.enabled) {
                this.input.keyboard.on('keydown-SHIFT', () => {
                    roomSprite.on('pointerdown', () => {
                        ///console.log(roomSprite)
                    }, roomSprite)
                })
            }


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
        this.roomPlayer = new RoomPlayer(this);

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

        this._socket.on('joinRoom', (playerId: any, playerX: any, playerY: any) => {
            console.log({ playerId: playerId, playerX: playerX, playerY: playerY })
            this.roomPlayer.addPlayerToRoom(playerId, playerX, playerY)
        })

        this._socket.on('playerMoved', (playerId: any, path: any, destination: any) => {
            console.log('moving player, current data: \n' + JSON.stringify({ playerId: playerId, path: path, destination: destination }))
            this.roomPlayer.movePlayer(playerId, path, destination)
        })

        this._socket.on('currentPlayers', (players: any) => {
            Object.keys(players).forEach((playerId: any) => {
                var player = players[playerId]
                this.roomPlayer.addPlayerToRoom(playerId, player.x, player.y);
            })
        })

        this._socket.on('playerDisconnected', (playerId:any) => {
            this.roomPlayer.removePlayerFromRoom(playerId);
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

        /*         var sofacoords = this.placeCoordsTest(5, 1)
                var coincoords = this.placeCoordsTest(2, 2) */

        /*         var presentCoords = this.coordsToIsometric(1, 2)
                //var calipCoords = this.coordsToIsometric(0, 0)
        
                var presentData = this.cache.json.get('present_gen1_data')
                //var calipData = this.cache.json.get('ads_calip_fan_data')
        
                var presentOffsets = presentData.assets.present_gen1_64_a_0_0
                //var calipOffsets = calipData.assets.ads_calip_fan_64_a_2_0
        
                var present = this.add.image(presentCoords.x + 32, presentCoords.y + 16, 'present_gen1', 'present_gen1_present_gen1_64_a_0_0.png').setDepth(1)
         */
        /*         var presentData = this.cache.json.get('present_gen1_data')
                var presentOffsets = presentData.assets.present_gen1_64_a_0_0
                console.log(presentOffsets)
                var present = this.add.image(0, 0, 'present_gen1', 'present_gen1_present_gen1_64_a_0_0.png').setDepth(1)
        
                present.x = this.getScreenX(2, 2) + 32;
                present.y = this.getScreenY(2, 2) + 16; */

        //var calipData = this.cache.json.get('ads_calip_fan_data')

        // layer 0 -> dir 0
        /*         var calipOffsets = calipData.assets.ads_calip_fan_64_a_2_0
                var test = calipData.visualization.directions[0].layers[1]
                console.log(test)
        
                var calip = this.add.image(0, 0, 'ads_calip_fan', 'ads_calip_fan_ads_calip_fan_64_a_2_0.png')
        
                calip.x = this.getScreenX(2, 2) + 32
                calip.y = this.getScreenY(2, 2) + 16
                
                calip.x += test.x
                calip.y += test.y
        
                calip.toggleFlipX()
                this.camera.setZoom(1)
         */
        //this.add.image(0, -100, 'tile')

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
    }

    /**
     * Runs once per frame for the duration of the scene
     * @override
     */
    public update(time: number, deltaTime: number): void {
        // if (this.tileDestination)
        // {
        //     var player = this.roomPlayer.players[this.avatarId]

        //     console.log({ tileDestinationX: this.tileDestination.x, tileDestinationY: this.tileDestination.y, playerX: Math.round(player.x) - 32, playerY: Math.round(player.y) + 27 })
        //     var playerXCoordinates = player.x - 32
        //     var playerYCoordinates = player.y + 27

        //     if (playerXCoordinates == this.tileDestination.x && playerYCoordinates == this.tileDestination.y)
        //     {
        //         console.log('stopped')
        //         player.body.stop()
        //         player.anims.stop()

        //         this.tileDestination = undefined
        //         // player.setTexture('avatar')
        //         // player.setFrame(`std_${this.avatarRotation}.png`)
        //     }
        // }
        /* 
                 */
        /*         if (this.avatarIsWalking)
                {
                    this.avatar.x += 1.0
                    this.avatar.y -= 0.5
                } */
        //console.log(time, deltaTime)
        // this.camera3d.transformChildren(this.transform);
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
}
