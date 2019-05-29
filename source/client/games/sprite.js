// @flow

import Phaser, { Physics, Textures } from 'phaser'

const { Texture, Frame } = Textures
const { Arcade } = Physics
const { Sprite } = Arcade

import Room from '../rooms/room'

import type { Vector } from '../../common/types/rooms/vector'
import type { Depth } from '../../common/enums/rooms/models/depth'

import RoomTile from '../rooms/tiles/tile'

/**
 * GameSprite class
 * @extends {Sprite}
 */
export default class GameSprite extends Sprite {

	+scene: Room
	+coordinates: Vector
	+depth: Depth
	+texture: Texture
	+frame: Frame

	/**
	 * @param {Room} scene - The room scene
	 * @param {Vector} coordinates - The coordinates of the sprite
	 * @param {Texture} texture - The sprite texture
	 * @param {Depth} depth - The sprite depth
	 */
	constructor(scene: Room, coordinates: Vector, depth: Depth, texture: Texture, frame: Frame) {

		super(scene, coordinates.x, coordinates.y - coordinates.z, texture, frame)

		this.scene = scene
		this.coordinates = coordinates
		this.depth = depth
		this.texture = texture
		this.frame = frame

	}

	/**
	 * Creates the sprite
	 */
	create(): void {
		
		this.scene.add.existing(this)

		//console.log(this.frame)
		//this.scene.add.sprite(0, 0, this.texture, this.frame)
		
		if (this.depth !== undefined) {
			this.setDepth(this.depth)
		}

		if (this.texture !== undefined) {
			this.setTexture(this.texture, this.frame)
		}

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