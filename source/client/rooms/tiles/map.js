import Phaser, { GameObjects } from 'phaser'

const { Group } = GameObjects

import RoomTile from './tile'

export default class RoomTileMap extends Group {

	constructor(scene, map) {

		super(scene)

		this.scene = scene
		this.map = map
		this.z = 0
		this.texture = 'tile'
		this.depth = 1

		this.create()

	}

	create() {

		for (var x = 0; x < this.map.length; x++) {
            
			for (var y = 0; y < this.map[x].length; y++) {

				if (this.map[x][y] > 0) {
					this.add(new RoomTile(this.scene, x, y, this.z, this.texture, this.depth))
				}

			}
		}
	}
}