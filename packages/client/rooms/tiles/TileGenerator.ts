import * as PIXI from 'pixi.js'

import RoomScene from "../RoomScene";
import Tile from "./Tile";

export default class TileGenerator extends PIXI.Graphics {
	private readonly room: RoomScene
	private readonly floorThickness: number

	public constructor(room: RoomScene) {
		super()

		this.room = room
		this.floorThickness = room.roomData.floorThickness

		this.generateTiles()
	}

	private generateTiles(): void {
		const scaleMode = PIXI.SCALE_MODES.LINEAR
		const renderer = PIXI.autoDetectRenderer()

		this.drawSurface()
		const tileSurfaceTexture = renderer.generateTexture(this, scaleMode, 1)

		this.drawRightBorder()
		const tileSurfaceEastTexture = renderer.generateTexture(this, scaleMode, 1)

		this.drawLeftBorder()
		const tileSurfaceEastSouthTexture = renderer.generateTexture(this, scaleMode, 1)

		// We clear cause we don't need right border for tile_l texture
		this.clear()
		this.drawSurface()
		this.drawLeftBorder()
		const tileSurfaceSouthTexture = renderer.generateTexture(this, scaleMode, 1)

		PIXI.Texture.addToCache(tileSurfaceTexture, 'tile')
		PIXI.Texture.addToCache(tileSurfaceEastTexture, 'tile_e')
		PIXI.Texture.addToCache(tileSurfaceEastSouthTexture, 'tile_es')
		PIXI.Texture.addToCache(tileSurfaceSouthTexture, 'tile_s')
	}

	private drawPoints(points: PIXI.Point[], strokePoints: { x: number, y: number }[]): void {
		this.drawPolygon(points)

		strokePoints.forEach((point, index) => {
			if (index === 0) {
				this.moveTo(point.x, point.y)
			} else {
				this.lineTo(point.x, point.y)
			}
		})
	}

	private drawSurface(): void {
		const [points, strokePoints] = [[
			new PIXI.Point(Tile.WIDTH / 2, 0),
			new PIXI.Point(Tile.WIDTH, Tile.HEIGHT / 2),
			new PIXI.Point(Tile.WIDTH / 2, Tile.HEIGHT),
			new PIXI.Point(0, Tile.HEIGHT / 2)
		], [
			{ x: Tile.WIDTH,     y: Tile.HEIGHT / 2 },
			{ x: Tile.WIDTH / 2, y: Tile.HEIGHT },
			{ x: 0,              y: Tile.HEIGHT / 2 }
		]]

		this.beginFill(0x989865)
		this.lineStyle(1.5, 0x8e8e5e)

		this.drawPoints(points, strokePoints)
	}

	private drawLeftBorder(): void {
		const [points, strokePoints] = [[
			new PIXI.Point(0, Tile.HEIGHT / 2),
			new PIXI.Point(0, Tile.HEIGHT / 2 + this.floorThickness),
			new PIXI.Point(Tile.WIDTH / 2, Tile.HEIGHT + this.floorThickness),
			new PIXI.Point(Tile.WIDTH / 2, Tile.HEIGHT)
		], [
			{ x: 0, y: Tile.HEIGHT / 2 },
			{ x: 0, y: Tile.HEIGHT / 2 + this.floorThickness }
		]]

		this.beginFill(0x838357)
		this.lineStyle(1, 0x7a7a51)

		this.drawPoints(points, strokePoints)
	}

	private drawRightBorder(): void {
		const [points, strokePoints] = [[
			new PIXI.Point(Tile.WIDTH / 2, Tile.HEIGHT),
			new PIXI.Point(Tile.WIDTH / 2, Tile.HEIGHT + this.floorThickness),
			new PIXI.Point(Tile.WIDTH, Tile.HEIGHT / 2 + this.floorThickness),
			new PIXI.Point(Tile.WIDTH, Tile.HEIGHT / 2)
		], [
			{ x: Tile.WIDTH, y: Tile.HEIGHT / 2 + this.floorThickness },
			{ x: Tile.WIDTH, y: Tile.HEIGHT / 2 }
		]]

		this.beginFill(0x6f6f49)
		this.lineStyle(1, 0x676744)

		this.drawPoints(points, strokePoints)
	}

}
