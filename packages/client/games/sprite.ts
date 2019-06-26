/* import Phaser, { Physics, Textures } from 'phaser'

const { Texture, Frame } = Textures
const { Arcade } = Physics
const { Sprite } = Arcade

import Room from '../rooms/room'

import { Vector } from '../../common/types/rooms/vector'
import { RoomModelDepth } from '../../common/enums/rooms/models/depth'

import RoomTile from '../rooms/tiles/tile'

export default class GameSprite extends Sprite {

	protected scene: Room
	protected coordinates: Vector
	protected textureName: string

	protected cartesianCoords!: Vector
	protected isometricCoords!: Vector

	constructor(scene: Room, coordinates: Vector, depth: RoomModelDepth, textureName: string, frame?: string | integer) 
	{
		super(scene, coordinates.x, coordinates.y - coordinates.z, textureName, frame)

		this.scene = scene
		this.coordinates = coordinates
		this.depth = depth
		this.textureName = textureName
	}

	protected create(): void 
	{
		this.setTexture(this.textureName)
		this.setDepth(this.depth)

		this.scene.add.existing(this)

		this.cartesianCoords = this.coordsToCartesian(this.coordinates)
		this.isometricCoords = this.toIsometric(this.cartesianCoords)
	}

	protected toIsometric(cartesian: Vector): Vector { 
		return { x: cartesian.x - cartesian.y, y: (cartesian.x + cartesian.y) / 2, z: cartesian.z }
	}

	protected toCartesian(isometric: Vector): Vector {
		return { x: (isometric.y * 2 + isometric.x) / 2, y: (isometric.y * 2 - isometric.x) / 2, z: isometric.z }
	}

	protected coordsToCartesian(coordinates: Vector): Vector {
		return { x: coordinates.x * 32, y: coordinates.y * 32, z: coordinates.z }
	}

	protected toCoords(cartesian: Vector): Vector {
		return { x: Math.floor(cartesian.x / 32), y: Math.floor(cartesian.y / 32), z: cartesian.z }
	}
} */