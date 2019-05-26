// @flow

import Phaser, { Physics } from 'phaser'

const { Arcade } = Physics
const { Sprite } = Arcade

import Room from './room'
import type { Vector } from '../utils/vector'

/**
 * RoomSprite class
 * @extends {Sprite}
 */
export default class RoomSprite extends Sprite {

	scene: Room
	x: number
	y: number
	z: number
	width: number
	height: number
	textures: string
	depth: number
	coordinates: Vector

	/**
	 * @param {Room} scene - The room scene
	 * @param {number} x - The x coordinate of the sprite
	 * @param {number} y - The y coordinate of the sprite
	 * @param {number} z - The z coordinate of the sprite
	 * @param {string} texture - The sprite texture
	 * @param {number} depth - The sprite depth
	 */
	constructor(scene: Room, x: number, y: number, z: number, texture: string, depth: number) {

		super(scene, x, y - z, texture)

		this.scene = scene
		this.x = x
		this.y = y
		this.z = z
		this.texture = texture
		this.width = 32
		this.height = 32
		this.depth = depth
		this.coordinates = { x, y, z }
	}

	/**
	 * Creates the sprite
	 */
	create(): void {
		
		this.scene.add.existing(this)

		this.cartesian = this.coordsToCartesian(this.coordinates)
		this.isometric = this.toIsometric(this.cartesian)

		this.setPosition(this.isometric.x, this.isometric.y)
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