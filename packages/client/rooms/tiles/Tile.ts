import * as PIXI from 'pixi.js'

import RoomScene from "../RoomScene";
import {HeightMapPosition} from '../map/HeightMap';
import Directions from "../map/directions/Directions";
import TilesContainer from "../containers/tiles/TilesContainer";
import Texture = PIXI.Texture;

export default class Tile extends PIXI.TilingSprite {
	public static readonly HEIGHT = 32
	public static readonly WIDTH = 64

	public static readonly HEIGHT_VALUE = 32

	public readonly heightMapPosition: HeightMapPosition

	private readonly room: RoomScene
	private readonly floorThickness: number

	public constructor(room: RoomScene, heightMapPosition: HeightMapPosition) {
		super(Texture.from('tile'), Tile.WIDTH, Tile.HEIGHT + room.roomData.floorThickness)

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
