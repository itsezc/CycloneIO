import IRoom from "../IRoom";
import {HeightMapPosition} from '../map/HeightMap';
import Directions from "../map/directions/Directions";

export default class Tile extends Phaser.GameObjects.Graphics {
	public static readonly HEIGHT = 32
	public static readonly WIDTH = 64

	public static readonly HEIGHT_VALUE = 32

	public readonly heightMapPosition: HeightMapPosition

	private readonly room: IRoom
	private readonly floorThickness: number

	public constructor(room: IRoom, heightMapPosition: HeightMapPosition) {
		super(room, {
			x: heightMapPosition.x * Tile.HEIGHT - heightMapPosition.y * Tile.HEIGHT + 600,
			y: (heightMapPosition.x * Tile.HEIGHT + heightMapPosition.y * Tile.HEIGHT) / 2 - Tile.HEIGHT_VALUE * heightMapPosition.height + 200
		})

		this.room = room
		this.heightMapPosition = heightMapPosition
		this.floorThickness = room.roomData.floorThickness

		this.drawTile()
		this.setInteractive()

		this.generateTexture('tile')
	}

	private drawTile(): void {
		const tilesAround = this.room.map.getTilePositionsAround(this.heightMapPosition.x, this.heightMapPosition.y)

		this.drawSurface()

		if (!tilesAround[Directions.EAST]
			|| tilesAround[Directions.EAST].height !== this.heightMapPosition.height
		) {
			this.drawRightBorder()
		}

		if (!tilesAround[Directions.SOUTH]
			|| tilesAround[Directions.SOUTH].height !== this.heightMapPosition.height) {
			this.drawLeftBorder()
		}
	}

	private drawSurface(): void {
		const [points, strokePoints] = [[
			{ x: 0, 			  y: -Tile.HEIGHT / 2 },
			{ x: Tile.WIDTH / 2,  y: 0 },
			{ x: 0, 			  y: Tile.HEIGHT / 2 },
			{ x: -Tile.WIDTH / 2, y: 0 }
		], [
			// We add 0.5 because if we don't there's a little
			// stroke overflow in the edges cause the stroke is 1.5
			{ x: -Tile.WIDTH / 2 + 0.5, y: 0 },
			{ x: 0, 			        y: Tile.HEIGHT / 2 },
			{ x: Tile.WIDTH / 2 - 0.5,  y: 0 }
		]]

		this.fillStyle(0x989865)
		this.lineStyle(1.5, 0x8e8e5e)

		this.fillPoints(points)
		this.strokePoints(strokePoints)
	}

	private drawLeftBorder(): void {
		const [points, strokePoints] = [[
			{ x: -Tile.WIDTH / 2, y: 0 },
			{ x: 0, 	 		  y: Tile.HEIGHT / 2 },
			{ x: 0, 	 		  y: Tile.HEIGHT / 2 + this.floorThickness },
			{ x: -Tile.WIDTH / 2, y: this.floorThickness }
		], [
			{ x: 0, y: Tile.HEIGHT / 2 },
			{ x: 0, y: Tile.HEIGHT / 2 + this.floorThickness }
		]]

		this.fillStyle(0x838357)
		this.lineStyle(1, 0x7a7a51)

		this.fillPoints(points, true)
		this.strokePoints(strokePoints, true)
	}

	private drawRightBorder(): void {
		const [points, strokePoints] = [[
			{ x: 0, 	 		 y: Tile.HEIGHT / 2 },
			{ x: Tile.WIDTH / 2, y: 0 },
			{ x: Tile.WIDTH / 2, y: this.floorThickness },
			{ x: 0, 	 		 y: Tile.HEIGHT / 2 + this.floorThickness }
		], [
			{ x: Tile.WIDTH / 2, y: 0 },
			{ x: Tile.WIDTH / 2, y: this.floorThickness }
		]]

		this.fillStyle(0x6f6f49)
		this.lineStyle(1, 0x676744)

		this.fillPoints(points, true)
		this.strokePoints(strokePoints, true)
	}

}
