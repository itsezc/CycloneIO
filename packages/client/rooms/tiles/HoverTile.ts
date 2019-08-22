import * as Phaser from 'phaser'
import RoomScene from "../RoomScene";
import {HeightMapPosition} from "../map/HeightMap";
import TilesContainer from "../containers/tiles/TilesContainer";

export default class HoverTile extends Phaser.GameObjects.Sprite {

	public constructor(room: RoomScene) {
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
