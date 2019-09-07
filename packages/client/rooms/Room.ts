import Phaser from 'phaser'

import Vector from '../../common/types/client/rooms/vector'
import {HabboEngine} from '../games/HabboEngine'
import RoomCamera from './RoomCamera'
import RoomContainer from './RoomContainer'
import FurnitureSprite from '../furniture/sprite'
import FurnitureData from '../furniture/data'
import Furniture from '../furniture/furniture'
import Path from 'path'
import {generateBlendMode} from '../core/blendMode';
import RoomAvatar from '../avatar/avatar'
import TileGenerator from '../generators/tile/TileGenerator'
import {RoomData} from "../../common/types/client/rooms/IRoom";
import ITileGenerator from "../generators/tile/ITileGenerator";

interface PlayerInfo {
	socketId: string;
	avatarData: any;
	avatar?: RoomAvatar;
}

/**
 * Room class, its a Phaser.Scene that contains all the players and furnis
 * @extends {Scene}
 */
export default class Room extends Phaser.Scene {

	private readonly roomData: RoomData

	public readonly engine: HabboEngine

	private _camera!: RoomCamera

	private assetsLoaded: boolean

	private _clickTime!: number

	public map: number[][]

	public path!: any

	private currentFPS: number

	public players: PlayerInfo[]

	public playerQueue: PlayerInfo[]

	private soundSample: Phaser.Sound.BaseSound

	private roomContainer: RoomContainer;

	private tileGenerator: ITileGenerator;


	/**
     * @param roomData The actual room in json data sent by the server
     * @param habboEngine The Engine that contains the actual socket connections and managers.
     */
	public constructor(roomData: RoomData, habboEngine: HabboEngine) {
		super({key: 'room'})

		this.roomData = roomData

		this.engine = habboEngine

		this.assetsLoaded = false

		this.players = []

		this.playerQueue = []

		this.tileGenerator = new TileGenerator({
			sprite: {
				width: 65,
				height: 40
			}
		})

	}

	/**
     * Runs once, loads up assets like images and audio
     */
	public preload() {

		//this.add.plugin(PhaserWebWorkers.plugin)
		//this.load.scenePlugin('Camera3DPlugin', 'phaser/plugins/camera3d.min.js', 'Camera3DPlugin', 'cameras3d')

		this.textures.addBase64('tile', this.tileGenerator.getDataURL())
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
		this._camera = new RoomCamera(this.cameras, {x: 0, y: 0}, window.innerWidth, window.innerHeight)
	}

	/**
     * Runs once, after all assets in preload are loaded
     */
	public create(): void {

		// const bubble = new ChatBubble(1, 'xd', 'xd', 'normal', this)

		const renderer = this.game.renderer

		generateBlendMode(renderer)

		this._camera.create()

		this.registerInputEvents()

		this.registerScaleEvents()

		const room: FurnitureData.IRoom = {
			door: [0, 3],
			// heightmap:
			// [
			//     [-1, -1, 1, 1, 1, 1, 1],
			//     [-1, -1, 1, 1, 1, 1, 1],
			//     [-1, -1, 1, 1, 1, 1, 1],
			//     [-1, -1, 1, 1, 1, 1, 1],
			//     [1, 1, 1, 1, 1],
			//     [0, 0, 0, 0, 0]
			// ],
			heightmap:
                [
                	[1, 1, 1, 1, 1, 1, 1],
                	[1, 1, 1, 1, 1, 1, 1],
                	[1, 1, 1, 1, 1, 1, 1],
                	[1, 1, 1, 1, 1, 1, 1],
                	[1, 1, 1, 1, 1, 1, 1],
                	[1, 1, 1, 1, 1, 1, 1],
                	[1, 1, 1, 1, 1, 1, 1]
                ],
			furnitures: [
				{
					name: 'diamond_dragon',
					roomX: 2,
					roomY: 3,
					roomZ: 0,
					direction: 3,
					animation: 2
				},
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
					name: 'throne',
					roomX: 0,
					roomY: 0,
					roomZ: 0,
					direction: 2
				},
				{
					name: 'throne',
					roomX: 1,
					roomY: 0,
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

		//this.add.image(0, 0, 'room_background').setDepth(2)

		this.roomContainer = new RoomContainer(this, room.heightmap, room.door)
		this.add.existing(this.roomContainer)

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
							// console.log('Animated Furni: ', furnitureRoomData.name, furnitureRoomData.animation)
							furnitureSprite.animateAndStart(furnitureRoomData.animation)
						} else {
							furnitureSprite.start()
						}

						if (furnitureRoomData.color) {
							furnitureSprite.setColor(furnitureData.color)
						}

						furnitureSprite.setDirection(furnitureRoomData.direction || 0)

						// console.log(furnitureSprite.furniture.data.name, furnitureSprite.depth)

						furnitureSprite.roomX = furnitureRoomData.roomX
						furnitureSprite.roomZ = furnitureRoomData.roomZ
						furnitureSprite.roomY = furnitureRoomData.roomY

						furnituresSprites.push(furnitureSprite)

						resolve();
					})

					this.roomContainer.start()
				})
			)
		})

		Promise.all(completedFurniPromises).then(() => {
			// const furnituresSorted = furnituresSprites.sort((a: FurnitureSprite, b: FurnitureSprite) => {
			// 	return (a.depth >= b.depth ? 1 : -1)
			// })

			furnituresSprites.forEach(furni => {
				this.roomContainer.addFurnitureSprite(furni, furni.roomX, furni.roomY, furni.roomZ)

			})
		})

		let genRandom = (min: number, max: number) =>// min and max included
		{
			return Math.floor(Math.random() * (max - min + 1) + min)
		}

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

		this.soundSample = this.sound.add('report')
		this.soundSample.play()

		// this.camera3d = this.cameras3d.add(100).setPosition(0, 0, 200);
		// this.transform = new Phaser.Math.Matrix4().rotateY(-0.01)

		// this.add.text(100, 100, `FPS: ${this.currentFPS || 'undefined'}`, { color: '#00ff00' })

		this.assetsLoaded = true

	}

	public removePlayer(socketId: string): void {
		let playerInfo: PlayerInfo = this.players.find(player => player.socketId === socketId)
		if (playerInfo) {
			let index = this.players.indexOf(playerInfo)
			this.players.splice(index, 1)
			playerInfo.avatar.destroy()
		}
	}

	public addPlayer(playerInfo: PlayerInfo): void {
		this.playerQueue.push(playerInfo)

	}

	public movePlayer(data: any): void {
		let player: PlayerInfo = this.players.find(
			(playerInfo: PlayerInfo) => {
				return playerInfo.socketId === data.socketId
			}
		)

		if (player) {
			player.avatar.x = data.coords.x
			player.avatar.y = data.coords.y

			player.avatar.setDepth(player.avatar.x + player.avatar.y + player.avatar.z)
			this.roomContainer.spritesContainer.sort('depth')

			console.log(`x ${player.avatar.x}`, `y ${player.avatar.y}`, `z ${player.avatar.z}`)

			let tmpX = player.avatar.RenderPos.x
			let tmpY = player.avatar.RenderPos.y

			player.avatar.x = tmpX
			player.avatar.y = tmpY

			console.log(data.socketId, player.avatar.depth)
		}
	}

	public addPlayers(players: PlayerInfo[]): void {
		players.forEach(player => this.playerQueue.push(player))
	}

	private orderFurnituresByType(furnitures: FurnitureData.IFurniture[]): FurnitureData.IFurniture[] {
		return furnitures.sort((a: FurnitureData.IFurniture, b: FurnitureData.IFurniture) => {
			if (a.type === FurnitureData.IFurnitureType.WALL) return -1
			else return 1
		})
	}

	private isValidCoordinateForFurniture(x: number, y: number, heightmap: number[][], type: FurnitureData.IFurnitureType = FurnitureData.IFurnitureType.FLOOR) {
		if (type === FurnitureData.IFurnitureType.FLOOR) {
			const height = this.getHeightByCoords(x, y, heightmap)

			return height != null && height !== 0
		} else if (type === FurnitureData.IFurnitureType.WALL) {
			return this.isValidWallPosition(x, y, heightmap)
		}
	}

	private getHeightByCoords(x: number, y: number, heightmap: number[][]) {
		const row = heightmap[y]

		if (row == null)
			return null

		const points = row
		const point = points[x]

		if (point == null)
			return null


		return point
	}

	private isValidWallPosition(x: number, y: number, heightmap: number[][]) {
		const realX = Math.floor(x)
		const realY = Math.floor(y)

		const height = this.getHeightByCoords(realX, realY, heightmap)

		if (height === 0)
			return false

		return !((x === 0 && y === 0) || (x > 0 && y > 0));
	}

	private calculateWallDirection(x: number, y: number) {
		return x > 0 ? 4 : 0
	}

	/**
     * Runs once per frame for the duration of the scene
     * @override
     */
	public update(time: number, delta: number): void {

		if (this.assetsLoaded && this.playerQueue.length > 0) {
			this.playerQueue.forEach((playerInfo: PlayerInfo, index: number) => {

				let newPlayer = new RoomAvatar(this, playerInfo.avatarData.x, playerInfo.avatarData.y, 0, 1)

				// newPlayer.setDepth(newPlayer.x + newPlayer.y + newPlayer.z)
				//
				// let tmpX = newPlayer.RenderPos.x
				// let tmpY = newPlayer.RenderPos.y
				//
				// newPlayer.x = tmpX
				// newPlayer.y = tmpY
				//
				//
				// this.add.existing(playerInfo.avatar)

				playerInfo.avatar = newPlayer
				this.players.push(playerInfo)

				this.roomContainer.addRoomAvatar(newPlayer)

				this.playerQueue.splice(index, 1)
			})
		}

		this.players.forEach((roomPlayer: PlayerInfo) => {
			roomPlayer.avatar.update(delta)
		})
		this.currentFPS = this.game.loop.actualFps
		// console.log('FPS', this.currentFPS)
	}

	public TileToScreenCoords(x: number, y: number) {
		let screenX = 0 + (1 + x - y) * 32;
		let screenY = 0 + (1 + x + y) * 16;

		return {x: screenX, y: screenY};
	}

	public TileToPixels(x: number, y: number) {
		let toX = (1 + x - y) * 32;
		let toY = (1 + x + y) * 16;

		return {x: toX, y: toY};
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

	public coordsToIsometric(x: number, y: number) {
		const toX = (x - y) * 32
		const toY = (x + y) * 16

		return {x: toX, y: toY}
	}

	public registerInputEvents(): void {
		this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
			if (pointer.primaryDown) {
				this._camera.scroll(pointer)
			} else {
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

	public cartesianToIsometric(cartesian: Vector): Vector {
		return {x: cartesian.x - cartesian.y, y: (cartesian.x + cartesian.y) / 2, z: cartesian.z}
	}

	/**
     * @param {Vector} isometric - The isometric coordinates of the sprite
     * @return {Vector} Cartesian coordinates of the sprite
     */
	public isometricToCartesian(isometric: Vector): Vector {
		return {x: (isometric.y * 2 + isometric.x) / 2, y: (isometric.y * 2 - isometric.x) / 2, z: isometric.z}
	}

	/**
     * @param {Vector} coordinates - The coordinates of the sprite
     * @return {Vector} Cartesian coordinates of the sprite
     */
	public coordsToCartesian(coordinates: Vector): Vector {
		return {x: coordinates.x * 32, y: coordinates.y * 32, z: coordinates.z}
	}

	/**
     * @param {Vector} cartesian - The cartesian coordinates of the sprites
     * @return {Vector} Coordinates of the sprite
     */
	public cartesianToCoords(cartesian: Vector): Vector {
		return {x: Math.floor(cartesian.x / 32), y: Math.floor(cartesian.y / 32), z: cartesian.z}
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

	public tileToLocal(x: number, y: number, z: number): Phaser.Geom.Point {
		return new Phaser.Geom.Point((x - y) * 32, (x + y) * 16 - (z * 16 * 2))
	}

	public convertOldToNewHeightMap(heightMap: string[]) {
		let newHeightMap: any = []
		heightMap.forEach((row: any) => newHeightMap.push(row.split('')))
		return newHeightMap[0].map((column: any, index: any) => newHeightMap.map((row: any) => Number(row[index].replace('0', 1).replace('x', 0))).reverse())
	}
}
