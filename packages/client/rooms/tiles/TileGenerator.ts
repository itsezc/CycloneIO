import * as PIXI from 'pixi.js-legacy'

import RoomScene from '../RoomScene'
import Tile from './Tile'

import HabboContainer from '../../injectors/HabboContainer'
import Habbo from '../../Habbo'

export default class TileGenerator extends PIXI.Graphics {
	private readonly room: RoomScene
	private readonly renderer: PIXI.Renderer | PIXI.CanvasRenderer
	private readonly floorThickness: number

	public constructor(room: RoomScene) {
		super()

		this.room = room

		const game = HabboContainer.get(Habbo)

		this.renderer = game.renderer
		this.floorThickness = room.roomData.floorThickness

		this.generateTileTextures()
	}

	// We do it by a Getter cause we need to access
	// other static properties from Tile class
	public static get SURFACE_POINTS(): number[] {
		return [
			Tile.WIDTH / 2, 0,
			Tile.WIDTH,     Tile.HEIGHT / 2,
			Tile.WIDTH / 2, Tile.HEIGHT,
			0,              Tile.HEIGHT / 2,
		]
	}

	private generateTileTextures(): void {
		const scaleMode = PIXI.settings.SCALE_MODE
		const resolution = 1

		this.generateSurface(scaleMode, resolution)
		this.clear()

		this.generateSurfaceEast(scaleMode, resolution)
		this.clear()

		this.generateSurfaceSouth(scaleMode, resolution)
		this.clear()

		this.generateSurfaceEastSouth(scaleMode, resolution)
		this.clear()
	}

	private drawPoints(points: number[], strokePoints: { x: number, y: number }[]): void {
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
		const strokePoints = [
			{ x: Tile.WIDTH,     y: Tile.HEIGHT / 2 },
			{ x: Tile.WIDTH / 2, y: Tile.HEIGHT },
			{ x: 0,              y: Tile.HEIGHT / 2 }
		]

		this.beginFill(0x989865)
		this.lineStyle(0.5, 0x8e8e5e)

		this.drawPoints(TileGenerator.SURFACE_POINTS, strokePoints)
	}

	private drawLeftBorder(): void {
		const [points, strokePoints] = [[
			0, 				Tile.HEIGHT / 2,
			0, 				Tile.HEIGHT / 2 + this.floorThickness,
			Tile.WIDTH / 2, Tile.HEIGHT + this.floorThickness,
			Tile.WIDTH / 2, Tile.HEIGHT
		], [
			{ x: 0, y: Tile.HEIGHT / 2 },
			{ x: 0, y: Tile.HEIGHT / 2 + this.floorThickness }
		]]

		this.beginFill(0x838357)
		this.lineStyle(0.5, 0x7a7a51)

		this.drawPoints(points, strokePoints)
	}

	private drawRightBorder(): void {
		const [points, strokePoints] = [[
			Tile.WIDTH / 2, Tile.HEIGHT,
			Tile.WIDTH / 2, Tile.HEIGHT + this.floorThickness,
			Tile.WIDTH, 	Tile.HEIGHT / 2 + this.floorThickness,
			Tile.WIDTH, 	Tile.HEIGHT / 2,
		], [
			{ x: Tile.WIDTH, y: Tile.HEIGHT / 2 + this.floorThickness },
			{ x: Tile.WIDTH, y: Tile.HEIGHT / 2 }
		]]

		this.beginFill(0x6f6f49)
		this.lineStyle(0.5, 0x676744)

		this.drawPoints(points, strokePoints)
	}

	private generateSurface(scaleMode: PIXI.SCALE_MODES, resolution: number): void {
		this.drawSurface()

		const texture = this.renderer.generateTexture(this, scaleMode, resolution)

		//const texture = this.generateCanvasTexture(scaleMode, resolution)

		PIXI.Texture.addToCache(texture, 'tile')
	}

	private generateSurfaceEast(scaleMode: PIXI.SCALE_MODES, resolution: number): void {
		this.drawSurface()
		this.drawRightBorder()

		//const texture = this.generateCanvasTexture(scaleMode, resolution)

		const texture = this.renderer.generateTexture(this, scaleMode, resolution)

		PIXI.Texture.addToCache(texture, 'tile_e')
	}

	private generateSurfaceSouth(scaleMode: PIXI.SCALE_MODES, resolution: number): void {
		this.drawSurface()
		this.drawLeftBorder()

		//const texture = this.generateCanvasTexture(scaleMode, resolution)

		const texture = this.renderer.generateTexture(this, scaleMode, resolution)

		PIXI.Texture.addToCache(texture, 'tile_s')
	}

	private generateSurfaceEastSouth(scaleMode: PIXI.SCALE_MODES, resolution: number): void {
		this.drawSurface()
		this.drawRightBorder()
		this.drawLeftBorder()

		//const texture = this.generateCanvasTexture(scaleMode, resolution)

		const texture = this.renderer.generateTexture(this, scaleMode, resolution)

		PIXI.Texture.addToCache(texture, 'tile_es')
	}
}
