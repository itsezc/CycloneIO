import Phaser, { GameObjects } from 'phaser'

const { Group } = GameObjects

import Room from '../room'
import RoomTile from './tile'

/**
 * RoomTileMap class
 * @extends {Group}
 */
export default class RoomTileMap extends Group {
	
	scene: Room
	map: number[][] | number[][][]
	z: number
	texture: string
	depth: number
	
	/**
	 * @param {Room} scene - The room scene
	 * @param {number[][] | number[][][]} map - The map array @example [ [1, 1], [1, 1] ]
	 */
	constructor(scene: Room, map: number[][] | number[][][]) {

		super(scene)

		this.scene = scene
		this.map = map
		this.z = 0
		this.texture = 'tile'
		this.depth = 1

		this.create()
	}

	/**
	 * Creates the map
	 */
	create(): void {

		for (var x = 0; x < this.map.length; x++) {
			for (var y = 0; y < this.map[x].length; y++) {
				
				if (this.map[x][y] > 0) {
					this.add(new RoomTile(this.scene, x, y, this.z, this.texture, this.depth))
				}
			}
		}
	}
}