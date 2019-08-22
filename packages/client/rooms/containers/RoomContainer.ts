import * as Phaser from 'phaser'

import RoomScene from "../RoomScene"
import TilesContainer from "./tiles/TilesContainer"

export default class RoomContainer extends Phaser.GameObjects.Container {
	private readonly tilesContainer: TilesContainer

	public constructor(room: RoomScene) {
		super(room)

		this.tilesContainer = new TilesContainer(room)

		this.addContainers()
	}

	private addContainers(): void {
		this.add(this.tilesContainer)
	}
}