// @flow

import Phaser, { GameObjects, Textures } from 'phaser'

const { Texture } = Textures

const { Group } = GameObjects

import Room from '../room'
import RoomModelDepth from '../../../common/enums/rooms/models/depth'
import RoomTile from './tile'

import type { Vector } from '../../../common/types/rooms/vector'

/**
 * RoomTileMap class
 * @extends {Group}
 */
export default class RoomTileMap extends Group {
	
	+scene: Room
	+map: Object

	/**
	 * @param {Room} scene - The room scene
	 * @param {Object} map - The map array @example [ [1, 1], [1, 1] ]
	 */
	constructor(scene: Room, map: Object) {

		super(scene)

		this.scene = scene
		this.map = map

	}

	/**
	 * Creates the map
	 */
	create(texture: Texture): void {

		for (var x = 0; x < this.map.length; x++) {

			for (var y = 0; y < this.map[x].length; y++) {
			
				if (this.map[x][y] > 0) {
					this.addTile({ x, y, z: 0 }, texture)
				}

			}
			
		}

	}

	addTile(coordinates: Vector, texture: Texture): void {

		this.tile = new RoomTile(this.scene, coordinates, texture)
		this.tile.create()

		this.add(this.tile)

	}
}