import Tile from "../tiles/Tile";

import RoomScene from "../RoomScene";
import { HeightMapPosition } from "../map/HeightMap";
import TilesContainer from "../containers/tiles/TilesContainer";

export default class Stair extends Tile {
	public readonly heightMapPosition: HeightMapPosition

	public constructor(room: RoomScene, heightMapPosition: HeightMapPosition) {
		super(room, heightMapPosition)

		this.heightMapPosition = heightMapPosition
		this.floorThickness = room.roomData.floorThickness

		const [x, y] = [
			TilesContainer.getScreenX(heightMapPosition),
			TilesContainer.getScreenY(heightMapPosition)
		]

		this.position.set(x, y)

	}
}