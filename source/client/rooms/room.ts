import Phaser from 'phaser'

import Vector from '../../common/types/rooms/vector'
import SocketIO from 'socket.io-client'

import Config, { server } from '../../../config.json'

const { host, port } = server

import RoomCamera from './camera'
// import RoomMap from './tiles/map'

/* import RoomItem from './items/item' */

/**
 * Room class
 * @extends {Scene}
 */
export default class Room extends Phaser.Scene
{

    private id: number
    private socket!: SocketIOClient.Socket

    private camera!: RoomCamera
    // private tileMap!: RoomTileMap
    // private item!: RoomItem

    private clickTime!: number
/* 
    private map!: RoomMap */

    /**
     * @param {number} id - The room id
     */
    constructor(id: number) 
    {
        super({ key: 'room' })
        this.id = id
    }

    /**
     * Runs once, loads up assets like images and audio
     */
    preload()
    {

        //this.add.plugin(PhaserWebWorkers.plugin)
        //this.load.scenePlugin('Camera3DPlugin', 'phaser/plugins/camera3d.min.js', 'Camera3DPlugin', 'cameras3d')

        this.load.image('tile', 'test/tile.png')
        this.load.atlas('coin','test/coin.png', 'test/coin.json')
        this.load.atlas('sofa', 'test/sofa.png', 'test/sofa.json')

        this.load.image('tile_hover', 'room/tile_hover.png')
        //this.load.atlas('tile', 'room/tile.png', 'room/tile.json')
        /*      this.load.image('tile', 'room/normal_tile.png')
                this.load.image('tile_left_edge', 'room/normal_tile_left_edge.png')
                this.load.image('tile_right_edge', 'room/normal_tile_right_edge.png')
                this.load.image('tile_border', 'room/normal_tile_border.png')
        
                this.load.atlas('wall', 'room/wall.png', 'room/wall.json')
                this.load.image('tile_hover', 'room/tile_hover.png')
                this.load.image('wall_right', 'room/wall_right.png')
                this.load.image('wall_left', 'room/wall_left.png')
                this.load.image('wall_right', 'room/wall_right.png')
                this.load.svg('stair_top', 'room/stair_top.svg')
                this.load.svg('stair_right', 'room/stair_right.svg') */

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
    public init(): void 
    {
        this.socket = SocketIO(`${host}:${port}`)
        this.camera = new RoomCamera(this.cameras, { x: 0, y: 0 }, window.innerWidth, window.innerHeight)

        // this.lights.enable()
    }

    /**
     * Runs once, after all assets in preload are loaded
     */
    public create(): void 
    {
        this.camera.create()

        this.registerInputEvents()

        /* this.map = new RoomMap(this, [[1, 1, 1]]) */

        var map = [[1, 1, 1], [1, 1, 1]]

        // loop for the array length and then for each sub array element length loop inside of it
        // 5.5

        var tileWidth = 64
        var thickness = 7.5

        var tile : Phaser.GameObjects.Graphics

        for (let y = 0; y < map.length; y++)
        {
            for (let x = 0; x < map[y].length; x++)
            {
                var isometricX = (x - y) * tileWidth / 2
                var isometricY = ((x + y) / 2) * tileWidth / 2

                var topTileSurface = new Phaser.Geom.Polygon(
                    [
                        new Phaser.Geom.Point(0, 0),
                        new Phaser.Geom.Point(tileWidth / 2, -tileWidth / 4),
                        new Phaser.Geom.Point(tileWidth, 0),
                        new Phaser.Geom.Point(tileWidth / 2, tileWidth / 4)
                    ])
                tile = this.add.graphics()

                tile.fillStyle(0x989865)
                tile.fillPoints(topTileSurface.points)

                tile.lineStyle(0.5, 0x8E8E5E)
                tile.strokePoints(topTileSurface.points)

                var leftTileThickness = new Phaser.Geom.Polygon(
                    [
                        new Phaser.Geom.Point(0, thickness),
                        new Phaser.Geom.Point(0, 0),
                        new Phaser.Geom.Point(tileWidth / 2, tileWidth / 4),
                        new Phaser.Geom.Point(tileWidth / 2, tileWidth / 4 + thickness)
                    ]
                )

                tile.fillStyle(0x838357)
                tile.fillPoints(leftTileThickness.points)

                tile.lineStyle(0.5, 0x7A7A51)
                tile.strokePoints(leftTileThickness.points)

                var bottomTileThickness = new Phaser.Geom.Polygon(
                    [
                        new Phaser.Geom.Point(tileWidth / 2, tileWidth / 4 + thickness),
                        new Phaser.Geom.Point(tileWidth / 2, tileWidth / 4),
                        new Phaser.Geom.Point(tileWidth, 0),
                        new Phaser.Geom.Point(tileWidth, thickness)
                    ],
                )

                tile.fillStyle(0x6F6F49)
                tile.fillPoints(bottomTileThickness.points)
                
                tile.lineStyle(0.5, 0x676744)
                tile.strokePoints(bottomTileThickness.points)

                tile.setInteractive(topTileSurface, Phaser.Geom.Polygon.Contains)

/*                 var tileHover: Phaser.GameObjects.Image

                tile.on('pointerover', () => {
                    tileHover = this.add.image(isometricX, isometricY, 'tile_hover')
                    tileHover.depth = 2
                    console.log(tile.x)
                })
    
                tile.on('pointerout', () => {
                    tileHover.destroy()
                })
 */
                tile.setPosition(isometricX, isometricY)
            }
        }

        var coin = this.add.image(96, 32, 'coin', '5_CF_1_coin_bronze_CF_1_coin_bronze_64_a_0_0')
        var sofa = this.add.image(69, -6, 'sofa', '5_hcsohva_hcsohva_64_a_2_0.png')
        var sofa2 = this.add.image(29, 0, 'sofa', '15_hcsohva_hcsohva_64_c_2_0.png')
        var sofa3 = this.add.image(15, 23, 'sofa', '22_hcsohva_hcsohva_64_d_2_0.png')

        coin.depth = 1
        sofa.depth = 1
        sofa2.depth = 1
        sofa3.depth = 1
        //this.add.image(0, -100, 'tile')

        // Zoom out (0.5). max: 10

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
    public update(): void
    {
        // this.camera3d.transformChildren(this.transform);
    }

    public registerInputEvents(): void 
    {
        this.input.on('pointermove', (pointer: any) => 
        {

            if (pointer.primaryDown) 
            {
                this.camera.scroll(pointer)

            }

            else 
            {
                this.camera.isScrolling = false
            }

        }, this)
    }

    public registerScaleEvents(): void 
    {
        this.scale.on('resize', (gameSize: any) => 
        {
            var width = gameSize.width
            var height = gameSize.height

            this.cameras.resize(width, height)

        }, this)
    }

    public emitRoom(): void 
    {
        this.socket.emit('newRoom', this.id)
    }

    public registerRoomsEvents(): void 
    {
        this.socket.on('newRoom', (map: any) => 
        {
            //this.addTileMap(map)
        })
    }

    public registerItemsEvents(): void
    {

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
    /**
	 * @param {Vector} cartesian - The cartesian coordinates of the sprite
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
    public onDoubleClick(object: Phaser.GameObjects.GameObject, callback: (...n: any) => any, ...args: any): void
    {

        object.on('pointerdown', (pointer: Phaser.Input.Pointer) =>
        {

            if (pointer.downTime - this.clickTime < 500)
            {
                if (pointer.primaryDown)
                {
                    callback(...args)
                }
            }

            this.clickTime = pointer.downTime
        })
    }
}
