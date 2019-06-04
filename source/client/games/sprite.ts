import Phaser, { Physics, Textures } from 'phaser'

const { Texture, Frame } = Textures
const { Arcade } = Physics
const { Sprite } = Arcade

import Room from '../rooms/room'

import { Vector } from '../../common/types/rooms/vector'
import { RoomModelDepth } from '../../common/enums/rooms/models/depth'

import RoomTile from '../rooms/tiles/tile'

/**
 * GameSprite class
 * @extends {Sprite}
 */
export default class GameSprite extends Sprite {

	protected scene: Room
	protected coordinates: Vector
	protected textureName: string

	protected cartesianCoords!: Vector
	protected isometricCoords!: Vector

	/**
	 * @param {Room} scene - The room scene
	 * @param {Vector} coordinates - The coordinates of the sprite
	 * @param {Texture} texture - The sprite texture
	 * @param {Depth} depth - The sprite depth
	 */
	constructor(scene: Room, coordinates: Vector, depth: RoomModelDepth, textureName: string, frame?: string | integer) 
	{
		super(scene, coordinates.x, coordinates.y - coordinates.z, textureName, frame)

		this.scene = scene
		this.coordinates = coordinates
		this.depth = depth
		this.textureName = textureName
	}

	/**
	 * Creates the sprite
	 */
	protected create(): void 
	{
		this.setTexture(this.textureName)
		this.setDepth(this.depth)

		this.scene.add.existing(this)

		this.cartesianCoords = this.coordsToCartesian(this.coordinates)
		this.isometricCoords = this.toIsometric(this.cartesianCoords)
	}

	/**
	 * @param {Vector} cartesian - The cartesian coordinates of the sprite
	 * @return {Vector} Isometric coordinates of the sprite
	 */
	protected toIsometric(cartesian: Vector): Vector { 
		return { x: cartesian.x - cartesian.y, y: (cartesian.x + cartesian.y) / 2, z: cartesian.z }
	}

	/**
	 * @param {Vector} isometric - The isometric coordinates of the sprite
	 * @return {Vector} Cartesian coordinates of the sprite
	 */
	protected toCartesian(isometric: Vector): Vector {
		return { x: (isometric.y * 2 + isometric.x) / 2, y: (isometric.y * 2 - isometric.x) / 2, z: isometric.z }
	}

	/**
	 * @param {Vector} coordinates - The coordinates of the sprite
	 * @return {Vector} Cartesian coordinates of the sprite
	 */
	protected coordsToCartesian(coordinates: Vector): Vector {
		return { x: coordinates.x * 32, y: coordinates.y * 32, z: coordinates.z }
	}

	/**
	 * @param {Vector} cartesian - The cartesian coordinates of the sprites
	 * @return {Vector} Coordinates of the sprite
	 */
	protected toCoords(cartesian: Vector): Vector {
		return { x: Math.floor(cartesian.x / 32), y: Math.floor(cartesian.y / 32), z: cartesian.z }
	}
}