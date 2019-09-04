import * as PIXI from 'pixi.js-legacy'

import RoomScene from '../RoomScene'
import TilesContainer from './tiles/TilesContainer'
import WallsContainer from "./walls/WallsContainer";

export default class RoomContainer extends PIXI.Container {
	public readonly tilesContainer: TilesContainer
	public readonly wallsContainer: WallsContainer

	public constructor(room: RoomScene) {
		super()

		this.tilesContainer = new TilesContainer(room)
		this.wallsContainer = new WallsContainer(room)

		this.addContainers()
	}

	private addContainers(): void {
		this.addChild(this.tilesContainer)
		this.addChild(this.wallsContainer)
	}
}