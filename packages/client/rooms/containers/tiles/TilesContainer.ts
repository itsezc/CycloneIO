import RoomScene from "../../RoomScene";
import Tile from "../../tiles/Tile";
import HoverTile from "../../tiles/HoverTile";
import TileGenerator from "../../tiles/TileGenerator";
import {HeightMapPosition} from "../../map/HeightMap";

export default class TilesContainer extends Phaser.GameObjects.Container {
	private readonly room: RoomScene
	private readonly tileGenerator: TileGenerator
	private readonly tiles: Tile[]
	private readonly hoverTile: HoverTile

	public constructor(room: RoomScene) {
		super(room)

		this.room = room
		this.tileGenerator = new TileGenerator(room)

		this.tiles = this.getTilesFromMap()

		this.hoverTile = new HoverTile(room)
		this.hoverTile.setVisible(false)

		this.add(this.tiles)
		this.add(this.hoverTile)
	}

	private getTilesFromMap(): Tile[] {
		const tiles: Tile[] = []

		for (const mapTile of this.room.map.tilePositions) {
			if (mapTile.height === -1)
				continue

			const tile = new Tile(this.room, mapTile)
			this.setTileEvents(tile)

			tiles.push(tile)
		}

		return tiles
	}

	private setTileEvents(tile: Tile): void {
		tile.on('pointerover', (): void => this.onTileHover(tile))
		tile.on('pointerout', (): void => this.onTileOut(tile))
	}

	private onTileHover(tile: Tile): void {
		this.hoverTile.setVisible(true)
		this.hoverTile.setHoverTilePosition(tile.heightMapPosition)
	}

	private onTileOut(tile: Tile): void {
		this.hoverTile.setVisible(false)
	}

	public static getScreenX(heightMapPosition: HeightMapPosition): number {
		return heightMapPosition.x * Tile.HEIGHT - heightMapPosition.y * Tile.HEIGHT + 600
	}

	public static getScreenY(heightMapPosition: HeightMapPosition): number {
		return (heightMapPosition.x * Tile.HEIGHT + heightMapPosition.y * Tile.HEIGHT) / 2 - Tile.HEIGHT_VALUE * heightMapPosition.height + 200
	}
}
