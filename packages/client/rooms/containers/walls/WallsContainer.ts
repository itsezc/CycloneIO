import * as PIXI from 'pixi.js-legacy'

import RoomScene from '../../RoomScene'
import WallGenerator from "../../walls/WallGenerator";
import Wall from "../../walls/Wall";

export default class WallsContainer extends PIXI.Container {
	private readonly room: RoomScene
	private readonly wallGenerator: WallGenerator
	private readonly walls: Wall[]

	public constructor(room: RoomScene) {
		super()

		this.room = room

		this.wallGenerator = new WallGenerator(room)

		this.walls = this.generateWallsFromMap()

		this.addChild(...this.walls)
	}

	private generateWallsFromMap(): Wall[] {
		const walls: Wall[] = []

		for (const mapTile of this.room.map.getWallPositions()) {
			if (mapTile.height === -1)
				continue


		}

		return walls
	}
}
