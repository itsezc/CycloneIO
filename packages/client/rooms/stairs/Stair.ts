import * as PIXI from 'pixi.js-legacy'

import Tile from "../tiles/Tile";

import RoomScene from "../RoomScene"
import { HeightMapPosition } from "../map/HeightMap"
import TilesContainer from "../containers/tiles/TilesContainer"

export default class Stair extends Tile {
	public readonly heightMapPosition: HeightMapPosition

	public constructor(room: RoomScene, heightMapPosition: HeightMapPosition) {
		super(room, heightMapPosition)

		this.heightMapPosition = heightMapPosition
		this.floorThickness = room.data.floorThickness

		const [x, y] = [
			TilesContainer.getScreenX(heightMapPosition),
			TilesContainer.getScreenY(heightMapPosition)
		]

		this.position.set(x, y)

		this.setTexture()

	}

	protected setTexture(): void {
		const { x, y } = this.heightMapPosition

		const tilesAround = this.room.map.getTilePositionsAround(x, y)

		const stairKey = 'stair_4'

		this.texture = PIXI.utils.TextureCache[stairKey]
	}
}