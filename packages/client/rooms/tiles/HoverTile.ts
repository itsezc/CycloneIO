import * as PIXI from 'pixi.js-legacy'

import { HeightMapPosition } from "../map/HeightMap";
import TilesContainer from "../containers/tiles/TilesContainer";

export default class HoverTile extends PIXI.Sprite {

	public constructor(texture: PIXI.Texture) {
		super(texture)
	}

	public setHoverTilePosition(heightMapPosition: HeightMapPosition): void {
		let [screenX, screenY] =  [
			TilesContainer.getScreenX(heightMapPosition),
			TilesContainer.getScreenY(heightMapPosition),
		]

		this.position.set(screenX, screenY - 4)
	}

}
