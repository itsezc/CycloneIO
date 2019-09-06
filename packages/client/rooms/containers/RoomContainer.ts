import * as PIXI from 'pixi.js-legacy'

import RoomScene from '../RoomScene'
import TilesContainer from './tiles/TilesContainer'
import WallsContainer from "./walls/WallsContainer";

export default class RoomContainer extends PIXI.Container {
	public readonly wallsContainer: WallsContainer
	public readonly tilesContainer: TilesContainer

	public constructor(room: RoomScene) {
		super()

		this.wallsContainer = new WallsContainer(room)
		this.tilesContainer = new TilesContainer(room)

		this.addContainers()
	}

	private addContainers(): void {
		this.addChild(this.wallsContainer)
		this.addChild(this.tilesContainer)
	}
}