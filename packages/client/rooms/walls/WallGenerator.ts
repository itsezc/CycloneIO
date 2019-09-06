import * as PIXI from "pixi.js-legacy"

import RoomScene from "../RoomScene"
import Directions from "../map/directions/Directions"
import Wall from "./Wall";

export default class WallGenerator extends PIXI.Graphics {
	private room: RoomScene

	private wallHeight: number
	private wallThickness: number

	public constructor(room: RoomScene) {
		super()

		this.room = room

		this.wallHeight = room.roomData.wallHeight
		this.wallThickness = room.roomData.wallThickness

		console.log(this.wallHeight, this.wallThickness)

		this.generateWallTextures()
	}

	private generateWallTextures() {
		const scaleMode = PIXI.SCALE_MODES.NEAREST
		const resolution = 1

		for (let dir = 0; dir < 2; dir++) {
			const direction = dir === 0 ? Directions.EAST : Directions.SOUTH

			this.generateSurfaceTop(scaleMode, resolution, direction)
			this.clear()
		}
	}

	private drawTop(direction: Directions): void {
		let points: number[],
			color = 0x6f717a

		if (direction === Directions.EAST) {
			points = [
				0,                           Wall.HEIGHT - Wall.HEIGHT / 5,
				Wall.WIDTH / 5,              Wall.HEIGHT,
				Wall.WIDTH,                  Wall.HEIGHT / 5,
				Wall.WIDTH - Wall.WIDTH / 5, 0
			]
		} else if (direction === Directions.SOUTH) {
			points = [
				Wall.WIDTH / 5,              0,
				Wall.WIDTH,                  Wall.HEIGHT - Wall.HEIGHT / 5,
				Wall.WIDTH - Wall.WIDTH / 5, Wall.HEIGHT,
				0,                           Wall.HEIGHT / 5
			]
		}

		this.beginFill(color)

		this.drawPolygon(points)
	}

	private drawSurface(direction: Directions): void {
		let points: number[],
			color: number

		if (direction === Directions.EAST) {
			color = 0x90929e

			points = [

			]
		} else if (direction === Directions.SOUTH) {
			color = 0xb6b8c7

			points = [

			]
		}

		this.beginFill(color)

		this.drawPolygon(points)
	}

	private generateSurfaceTop(scaleMode: PIXI.SCALE_MODES, resolution: number, direction: Directions) {
		this.drawTop(direction)
		this.drawSurface(direction)

		const texture = this.generateCanvasTexture(scaleMode, resolution)

		PIXI.Texture.addToCache(texture, `wall_${direction}`)

		const extract = new PIXI.extract.Extract(PIXI.autoDetectRenderer({
			antialias: true
		}))

		const sprite = PIXI.Sprite.from(texture)

		const base = extract.base64(sprite)

		console.log(base)
	}
}