import * as Phaser from 'phaser'
import IRoom from "../IRoom";
import Tile from "./Tile";
import {HeightMapPosition} from "../map/HeightMap";

export default class HoverTile extends Phaser.GameObjects.Sprite {

	public constructor(room: IRoom) {
		super(room, 0, 0, 'tile_hover')
	}

	public setHoverTilePosition(heightMapPosition: HeightMapPosition): void {
		let [screenX, screenY] =  [
			heightMapPosition.x * Tile.HEIGHT - heightMapPosition.y * Tile.HEIGHT + 600,
			(heightMapPosition.x * Tile.HEIGHT + heightMapPosition.y * Tile.HEIGHT) / 2 - Tile.HEIGHT_VALUE * heightMapPosition.height + 200
		]

		this.setPosition(screenX, screenY)
	}

}
