// @flow

import Phaser, { Physics, Textures } from 'phaser'

const { Texture, Frame } = Textures
const { Arcade } = Physics
const { Sprite } = Arcade

import Room from '../rooms/room'

import { Vector } from '../../common/types/rooms/vector'
import { Depth } from '../../common/enums/rooms/models/depth'

import RoomTile from '../rooms/tiles/tile'

/**
 * GameSprite class
 * @extends {Sprite}
 */
export default class GameSprite extends Sprite {

	private coordinates: Vector
	private cartesianCoords: Vector
	private isometricCoords: Vector

	/**
	 * @param {Room} scene - The room scene
	 * @param {Vector} coordinates - The coordinates of the sprite
	 * @param {Texture} texture - The sprite texture
	 * @param {Depth} depth - The sprite depth
	 */
	constructor(scene: Room, coordinates: Vector, depth: number, texture: string, frame?: string | integer) {

		super(scene, coordinates.x, coordinates.y - coordinates.z, texture, frame)

		this.depth = depth
		this.coordinates = coordinates
	}

	/**
	 * Creates the sprite
	 */
	public create(): void {
		
		/* 
		this.setDepth(this.depth)
		this.setTexture(this.texture, this.frame) */

		this.scene.add.existing(this)

		this.cartesianCoords = this.coordsToCartesian(this.coordinates)
		this.isometricCoords = this.toIsometric(this.cartesianCoords)
	}

	/**
	 * @param {Vector} cartesian - The cartesian coordinates of the sprite
	 * @return {Vector} Isometric coordinates of the sprite
	 */
	toIsometric(cartesian: Vector): Vector { 
		return { x: cartesian.x - cartesian.y, y: (cartesian.x + cartesian.y) / 2, z: cartesian.z }
	}

	/**
	 * @param {Vector} isometric - The isometric coordinates of the sprite
	 * @return {Vector} Cartesian coordinates of the sprite
	 */
	toCartesian(isometric: Vector): Vector {
		return { x: (isometric.y * 2 + isometric.x) / 2, y: (isometric.y * 2 - isometric.x) / 2, z: isometric.z }
	}

	/**
	 * @param {Vector} coordinates - The coordinates of the sprite
	 * @return {Vector} Cartesian coordinates of the sprite
	 */
	coordsToCartesian(coordinates: Vector): Vector {
		return { x: coordinates.x * RoomTile.width, y: coordinates.y * RoomTile.height, z: coordinates.z }
	}

	/**
	 * @param {Vector} cartesian - The cartesian coordinates of the sprites
	 * @return {Vector} Coordinates of the sprite
	 */
	toCoords(cartesian: Vector): Vector {
		return { x: Math.floor(cartesian.x / RoomTile.width), y: Math.floor(cartesian.y / RoomTile.height), z: cartesian.z }
	}
}