import IRoom from "../IRoom";
import {HeightMapPosition} from '../map/HeightMap';
import Directions from "../map/directions/Directions";
import TilesContainer from "../containers/tiles/TilesContainer";

export default class Tile extends Phaser.GameObjects.Sprite {
	public static readonly HEIGHT = 32
	public static readonly WIDTH = 64

	public static readonly HEIGHT_VALUE = 32

	public readonly heightMapPosition: HeightMapPosition

	private readonly room: IRoom
	private readonly floorThickness: number

	public constructor(room: IRoom, heightMapPosition: HeightMapPosition) {
		super(room,
			  TilesContainer.getScreenX(heightMapPosition),
			  TilesContainer.getScreenY(heightMapPosition),
			  undefined)

		this.room = room
		this.heightMapPosition = heightMapPosition
		this.floorThickness = room.roomData.floorThickness

		this.setTileTexture()
		this.setInteractive({ pixelPerfect: true })
	}

	private setTileTexture() {
		const tilesAround = this.room.map.getTilePositionsAround(this.heightMapPosition.x, this.heightMapPosition.y)

		let eastBorder = this.isEastBorderNeeded(tilesAround)
		let southBorder = this.isSouthBorderNeeded(tilesAround)

		const tileKey = this.getTileTexture(eastBorder, southBorder)

		this.setTexture(tileKey)
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
