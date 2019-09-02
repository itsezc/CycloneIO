import * as PIXI from 'pixi.js-legacy'

import RoomScene from '../RoomScene'
import TilesContainer from './tiles/TilesContainer'

export default class RoomContainer extends PIXI.Container {
	public readonly tilesContainer: TilesContainer

	public constructor(room: RoomScene) {
		super()

		this.tilesContainer = new TilesContainer(room)

		this.addContainers()
	}

	private addContainers(): void {
		this.addChild(this.tilesContainer)
	}
}