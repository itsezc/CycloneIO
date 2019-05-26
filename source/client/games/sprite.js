// @flow

import Phaser, { Physics } from 'phaser'

const { Arcade } = Physics
const { Sprite } = Arcade

import Room from '../rooms/room'
import type { Vector } from '../../common/types/vector'

/**
 * GameSprite class
 * @extends {Sprite}
 */
export default class GameSprite extends Sprite {

	scene: Room
	coordinates: Vector
	width: number
	height: number
	textures: string
	depth: number

	/**
	 * @param {Room} scene - The room scene
	 * @param {Vector} coordinates - The coordinates of the sprite
	 * @param {string} texture - The sprite texture
	 * @param {number} depth - The sprite depth
	 */
	constructor(scene: Room, coordinates: Vector, texture: string, depth: number) {

		super(scene, coordinates.x, coordinates.y - coordinates.z, texture)

		this.scene = scene
		this.texture = texture
		this.depth = depth

	}

	/**
	 * Creates the sprite
	 */
	create(): void {
		
		this.scene.add.existing(this)

		this.setDepth(this.depth)
		this.setTexture(this.texture)

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
		return { x: coordinates.x * this.width, y: coordinates.y * this.height, z: coordinates.z }
	}

	/**
	 * @param {Vector} cartesian - The cartesian coordinates of the sprites
	 * @return {Vector} Coordinates of the sprite
	 */
	toCoords(cartesian: Vector): Vector {
		return { x: Math.floor(cartesian.x / this.width), y: Math.floor(cartesian.y / this.height), z: cartesian.z }
	}
}