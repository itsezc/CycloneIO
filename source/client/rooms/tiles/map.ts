// @flow

import Phaser, { GameObjects, Textures } from 'phaser'

const { Texture } = Textures
const { Group } = GameObjects

import Room from '../room'
import { RoomModelDepth } from '../../../common/enums/rooms/models/depth'
import RoomTile from './tile'

import { Vector } from '../../../common/types/rooms/vector'

/**
 * RoomTileMap class
 * @extends {Group}
 */
export default class RoomTileMap extends Group {
	
	scene: Room

	private map: number[][]
	private tile!: RoomTile

	/**
	 * @param {Room} scene - The room scene
	 * @param {Object} map - The map array @example [ [1, 1], [1, 1] ]
	 */
	constructor(scene: Room, map: number[][]) {

		super(scene)

		this.scene = scene
		this.map = map
	}

	/**
	 * Creates the map
	 * @override
	 */
	public create(): void {

		for (var x = 0; x < this.map.length; x++) {

			for (var y = 0; y < this.map[x].length; y++) {
			
				if (this.map[x][y] > 0) {
					//this.addTile({ x, y, z: 0 }, texture)
				}
			}
		}
	}

	addTile(coordinates: Vector, texture: any): void {

		this.tile = new RoomTile(this.scene, coordinates, RoomModelDepth.TILE, texture)
		this.tile.create()

		//this.add(this.tile)
	}
}