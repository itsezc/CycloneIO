import * as PIXI from 'pixi.js-legacy'

import RoomScene from '../RoomScene'
import {HeightMapPosition} from '../map/HeightMap'
import Directions from '../map/directions/Directions'
import TilesContainer from '../containers/tiles/TilesContainer'
import TileGenerator from './TileGenerator'

export default class Tile extends PIXI.Sprite {
	public static readonly HEIGHT = 32
	public static readonly WIDTH = 64

	public static readonly HEIGHT_VALUE = 32

	public readonly heightMapPosition: HeightMapPosition

	protected readonly room: RoomScene
	protected floorThickness: number

	public constructor(room: RoomScene, heightMapPosition: HeightMapPosition) {
		super(undefined)

		this.room = room
		this.heightMapPosition = heightMapPosition
		this.floorThickness = room.roomData.floorThickness

		const [x, y] = [
			TilesContainer.getScreenX(heightMapPosition),
			TilesContainer.getScreenY(heightMapPosition)
		]

		this.position.set(x, y)

		this.setTileTexture()

		this.interactive = true
		this.hitArea = new PIXI.Polygon(TileGenerator.SURFACE_POINTS)
	}

	private setTileTexture() {
		const { x, y } = this.heightMapPosition

		const tilesAround = this.room.map.getTilePositionsAround(x, y)

		const [eastBorder, southBorder] = [
			this.isEastBorderNeeded(tilesAround),
			this.isSouthBorderNeeded(tilesAround)
		]

		const tileKey = this.getTileTexture(eastBorder, southBorder)

		this.texture = PIXI.utils.TextureCache[tileKey]
	}

	private isEastBorderNeeded(tilesAround: HeightMapPosition[]): boolean {
		return !tilesAround[Directions.EAST]
			|| tilesAround[Directions.EAST].height !== this.heightMapPosition.height
	}

	private isSouthBorderNeeded(tilesAround: HeightMapPosition[]): boolean {
		return !tilesAround[Directions.SOUTH]
			|| tilesAround[Directions.SOUTH].height !== this.heightMapPosition.height
	}

	private getTileTexture(eastBorder: boolean, southBorder: boolean): string {
		let key = ''

		if (eastBorder && !southBorder) {
			key = 'tile_e'
		} else if (eastBorder && southBorder) {
			key = 'tile_es'
		} else if (!eastBorder && southBorder) {
			key = 'tile_s'
		} else {
			key = 'tile'
		}

		return key
	}

}
