import IRoom from "../../IRoom";
import Tile from "../../tiles/Tile";
import {HeightMapPosition} from "../../map/HeightMap";

export default class TilesContainer extends Phaser.GameObjects.Container {
	private readonly room: IRoom
	private readonly tiles: Tile[]

	public constructor(room: IRoom) {
		super(room)

		this.room = room

		this.tiles = this.getTilesFromMap()

		this.add(this.tiles)
	}

	private getTilesFromMap(): Tile[] {
		const tiles: Tile[] = []

		for (const mapTile of this.room.map.tilePositions) {
			if (mapTile.height === -1)
				continue

			const tile = new Tile(this.room, mapTile)

			tiles.push(tile)
		}

		return tiles
	}
}
