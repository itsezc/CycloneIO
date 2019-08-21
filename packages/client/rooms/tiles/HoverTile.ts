import * as Phaser from 'phaser'
import IRoom from "../IRoom";
import {HeightMapPosition} from "../map/HeightMap";
import TilesContainer from "../containers/tiles/TilesContainer";

export default class HoverTile extends Phaser.GameObjects.Sprite {

	public constructor(room: IRoom) {
		super(room, 0, 0, 'tile_hover')
	}

	public setHoverTilePosition(heightMapPosition: HeightMapPosition): void {
		let [screenX, screenY] =  [
			TilesContainer.getScreenX(heightMapPosition),
			TilesContainer.getScreenY(heightMapPosition),
		]

		this.setPosition(screenX, screenY - 4)
	}

}
