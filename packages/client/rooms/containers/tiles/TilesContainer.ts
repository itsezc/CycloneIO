import RoomScene from "../../RoomScene";
import Tile from "../../tiles/Tile";
import HoverTile from "../../tiles/HoverTile";
import TileGenerator from "../../tiles/TileGenerator";
import {HeightMapPosition} from "../../map/HeightMap";
import Habbo from "../../../Habbo";

export default class TilesContainer extends Phaser.GameObjects.Container {
	private readonly room: RoomScene
	private readonly tileGenerator: TileGenerator
	private readonly tiles: Tile[]
	private readonly hoverTile: HoverTile

	private readonly debugTextCoords: Phaser.GameObjects.Text[]

	public constructor(room: RoomScene) {
		super(room)

		this.room = room
		this.tileGenerator = new TileGenerator(room)

		this.tiles = this.getTilesFromMap()

		this.hoverTile = new HoverTile(room)
		this.hoverTile.setVisible(false)

		this.add(this.tiles)
		this.add(this.hoverTile)

		// if (Habbo.DEBUG) {
		// 	this.debugTextCoords = this.getDebugTextCoords()
		//
		// 	this.add(this.debugTextCoords)
		// }
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

	public getTileAt(x: number, y: number): Tile | undefined {
		return this.tiles.find((t): boolean => t.heightMapPosition.x === x && t.heightMapPosition.y === y)
	}

	private getDebugTextCoords(): Phaser.GameObjects.Text[] {
		const texts: Phaser.GameObjects.Text[] = []

		for (const tile of this.tiles) {
			const screenX = TilesContainer.getScreenX(tile.heightMapPosition)
			const screenY = TilesContainer.getScreenY(tile.heightMapPosition);

			const text = new Phaser.GameObjects.Text(
				this.room,
				 screenX,
				screenY - Tile.HEIGHT * tile.heightMapPosition.height - this.room.roomData.floorThickness,
				`(${tile.heightMapPosition.x},${tile.heightMapPosition.y})`,
				{
					color: 'rgba(255, 255, 255, 0.5)',
					fontSize: '11px',
					fontFamily: 'monospace'
				}
			)

			text.setOrigin(0.5, 0.25)

			texts.push(text)
		}

		return texts
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
		return heightMapPosition.x * Tile.HEIGHT - heightMapPosition.y * Tile.HEIGHT
	}

	public static getScreenY(heightMapPosition: HeightMapPosition): number {
		return (heightMapPosition.x * Tile.HEIGHT + heightMapPosition.y * Tile.HEIGHT) / 2 - Tile.HEIGHT_VALUE * heightMapPosition.height
	}
}
