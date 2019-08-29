import * as PIXI from 'pixi.js-legacy'

import RoomScene from "../../RoomScene";
import Tile from "../../tiles/Tile";
import HoverTile from "../../tiles/HoverTile";
import TileGenerator from "../../tiles/TileGenerator";
import {HeightMapPosition} from "../../map/HeightMap";
import Habbo from "../../../Habbo";

export default class TilesContainer extends PIXI.Container {
	private readonly room: RoomScene
	private readonly tileGenerator: TileGenerator
	private readonly tiles: Tile[]
	private readonly hoverTile: HoverTile

	private readonly debugTextCoords: PIXI.Text[]

	public constructor(room: RoomScene) {
		super()

		this.room = room

		this.tileGenerator = new TileGenerator(room)

		this.tiles = this.getTilesFromMap()

		const hoverTileTexture = this.room.resources['tile_hover'].texture

		this.hoverTile = new HoverTile(hoverTileTexture)
		this.hoverTile.visible = false

		this.addChild(...this.tiles)
		this.addChild(this.hoverTile)

		if (Habbo.DEBUG) {
			this.debugTextCoords = this.getDebugTextCoords()

			this.addChild(...this.debugTextCoords)
		}
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

	private getDebugTextCoords(): PIXI.Text[] {
		const texts: PIXI.Text[] = []

		for (const tile of this.tiles) {
			const screenX = TilesContainer.getScreenX(tile.heightMapPosition)
			const screenY = TilesContainer.getScreenY(tile.heightMapPosition) - Tile.HEIGHT * tile.heightMapPosition.height - this.room.roomData.floorThickness

			const text = new PIXI.Text(
				`(${tile.heightMapPosition.x},${tile.heightMapPosition.y})`,
				{
					fill: 'rgba(255, 255, 255, 0.5)',
					fontSize: '11px',
					fontFamily: 'monospace'
				}
			)

			text.position.set(screenX, screenY)
			text.anchor.set(-0.5, -1.5)

			texts.push(text)
		}

		return texts
	}

	private setTileEvents(tile: Tile): void {
		tile.on('pointerover', (): void => this.onTileHover(tile))
		tile.on('pointerout', (): void => this.onTileOut())
	}

	private onTileHover(tile: Tile): void {
		this.hoverTile.visible = true
		this.hoverTile.setHoverTilePosition(tile.heightMapPosition)
	}

	private onTileOut(): void {
		this.hoverTile.visible = false
	}

	public static getScreenX(heightMapPosition: HeightMapPosition): number {
		return heightMapPosition.x * Tile.HEIGHT - heightMapPosition.y * Tile.HEIGHT
	}

	public static getScreenY(heightMapPosition: HeightMapPosition): number {
		return (heightMapPosition.x * Tile.HEIGHT + heightMapPosition.y * Tile.HEIGHT) / 2 - Tile.HEIGHT_VALUE * heightMapPosition.height
	}
}
