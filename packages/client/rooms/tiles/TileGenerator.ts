import RoomScene from "../RoomScene";
import {HeightMapPosition} from '../map/HeightMap';
import Directions from "../map/directions/Directions";
import Tile from "./Tile";
import TilesContainer from "../containers/tiles/TilesContainer";

export default class TileGenerator extends Phaser.GameObjects.Graphics {
	private readonly room: RoomScene
	private readonly floorThickness: number

	public constructor(room: RoomScene) {
		super(room, {x: 500, y: 500 })

		this.room = room
		this.floorThickness = room.roomData.floorThickness

		this.drawTile()
	}

	private drawTile(): void {
		this.drawSurface()
		this.generateTexture('tile', Tile.WIDTH, Tile.HEIGHT + this.floorThickness)

		this.drawRightBorder()
		this.generateTexture('tile_e', Tile.WIDTH, Tile.HEIGHT + this.floorThickness)

		this.drawLeftBorder()
		this.generateTexture('tile_es', Tile.WIDTH, Tile.HEIGHT + this.floorThickness)

		// We clear cause we don't need right border for tile_l texture
		this.clear()
		this.drawSurface()
		this.drawLeftBorder()
		this.generateTexture('tile_s', Tile.WIDTH, Tile.HEIGHT + this.floorThickness)
	}

	private drawSurface(): void {
		const [points, strokePoints] = [[
			{ x: Tile.WIDTH / 2, y: 0 },
			{ x: Tile.WIDTH,     y: Tile.HEIGHT / 2 },
			{ x: Tile.WIDTH / 2, y: Tile.HEIGHT },
			{ x: 0,              y: Tile.HEIGHT / 2 }
		], [
			// We add 0.5 because if we don't there's a little
			// stroke overflow in the edges cause the stroke is 1.5
			{ x: Tile.WIDTH,     y: Tile.HEIGHT / 2 },
			{ x: Tile.WIDTH / 2, y: Tile.HEIGHT },
			{ x: 0,              y: Tile.HEIGHT / 2 }
		]]

		this.fillStyle(0x989865)
		this.lineStyle(1.5, 0x8e8e5e)

		this.fillPoints(points)
		this.strokePoints(strokePoints)
	}

	private drawLeftBorder(): void {
		const [points, strokePoints] = [[
			{ x: 0,              y: Tile.HEIGHT / 2 },
			{ x: 0,              y: Tile.HEIGHT / 2 + this.floorThickness },
			{ x: Tile.WIDTH / 2, y: Tile.HEIGHT + this.floorThickness },
			{ x: Tile.WIDTH / 2, y: Tile.HEIGHT }
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
			{ x: Tile.WIDTH / 2, y: Tile.HEIGHT },
			{ x: Tile.WIDTH / 2, y: Tile.HEIGHT + this.floorThickness },
			{ x: Tile.WIDTH,     y: Tile.HEIGHT / 2 + this.floorThickness },
			{ x: Tile.WIDTH,     y: Tile.HEIGHT / 2 }
		], [
			{ x: Tile.WIDTH, y: Tile.HEIGHT / 2 + this.floorThickness },
			{ x: Tile.WIDTH, y: Tile.HEIGHT / 2 }
		]]

		this.fillStyle(0x6f6f49)
		this.lineStyle(1, 0x676744)

		this.fillPoints(points, true)
		this.strokePoints(strokePoints, true)
	}

}
