// @flow

import Phaser, { Physics, Textures } from 'phaser'

const { Texture } = Textures
const { Arcade } = Physics
const { Sprite } = Arcade

import Room from '../rooms/room'

import type { Vector } from '../../common/types/rooms/vector'
import type { Depth } from '../../common/enums/rooms/models/depth'

import RoomTile from '../rooms/tiles/tile'

import Path from 'path'

/**
 * GameSprite class
 * @extends {Sprite}
 */
export default class GameSprite extends Sprite {

	+scene: Room
	+coordinates: Vector
	+texture: Texture
	+depth: Depth

	/**
	 * @param {Room} scene - The room scene
	 * @param {Vector} coordinates - The coordinates of the sprite
	 * @param {Texture} texture - The sprite texture
	 * @param {Depth} depth - The sprite depth
	 */
	constructor(scene: Room, coordinates: Vector, texture: Texture, depth: Depth) {

		super(scene, coordinates.x, coordinates.y - coordinates.z, texture)

		this.scene = scene
		this.coordinates = coordinates
		this.texture = texture
		this.depth = depth

	}

	load(asset: string): void {

		this.scene.load.setPath(Path.join(asset, this.texture))
		this.scene.load.atlas({ key: this.texture, textureURL: this.texture.concat('.png'), atlasURL: this.texture.concat('.json') })
		this.scene.load.start()

	}

	/**
	 * Creates the sprite
	 */
	create(): void {
		
		this.scene.add.existing(this)

		this.setDepth(this.depth)
		this.setTexture(this.texture)

		this.cartesian = this.coordsToCartesian(this.coordinates)
		this.isometric = this.toIsometric(this.cartesian)

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