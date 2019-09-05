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
		const walls: Wall[] = this.room.map.getWallPositions()
			.map((value): Wall => new Wall(value))

		console.log(walls)

		return walls
	}
}
