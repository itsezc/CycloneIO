import * as PIXI from 'pixi.js-legacy'

import RoomScene from '../RoomScene'
import Directions from '../map/directions/Directions'
import Stair from './Stair'

import HabboContainer from '../../injectors/HabboContainer'
import Habbo from '../../Habbo'

export default class StairGenerator extends PIXI.Graphics {
	private readonly room: RoomScene
	private readonly renderer: PIXI.Renderer | PIXI.CanvasRenderer
	private readonly stairThickness: number

	public constructor(room: RoomScene) {
		super()

		this.room = room

		const game = HabboContainer.get(Habbo)

		this.renderer = game.renderer
		this.stairThickness = this.room.roomData.floorThickness

		this.generateStairTextures()
	}

	private generateStairTextures(): void {
		const scaleMode = PIXI.settings.SCALE_MODE
		const resolution = 1

		const possibleDirections = [Directions.EAST, Directions.SOUTH_EAST, Directions.SOUTH, Directions.SOUTH_WEST, Directions.WEST]

		Directions.forEach((direction): void => {
			if (!possibleDirections.includes(direction)) {
				return
			}

			this.generateSurface(scaleMode, resolution, direction)
			this.clear()
		})
	}

	private generateSurface(scaleMode: PIXI.SCALE_MODES, resolution: number, direction: Directions): void {
		this.drawSurfaces(direction)

		const texture = this.renderer.generateTexture(this, scaleMode, resolution)

		console.log(`stair_${direction}`)
		PIXI.Texture.addToCache(texture, `stair_${direction}`)
	}

	private drawSurfaces(direction: Directions) {
		const color = 0x989865,
			strokeColor = 0x8e8e5e

		this.beginFill(color)
		this.lineStyle(0.5, strokeColor)

		if (direction === Directions.EAST) {
			// let firstSurface = [
			// 	Stair.WIDTH / 2, Stair.HEIGHT / 2,
			// 	0, Stair.HEIGHT,
			// 	0 - Stair.HEIGHT / 4, Stair.HEIGHT - Stair.HEIGHT / 8,
			// 	Stair.WIDTH / 2 - Stair.HEIGHT / 4, Stair.HEIGHT / 2 - Stair.HEIGHT / 8,
			// 	0, 0,
			// 	0 - Stair.HEIGHT / 4, 0 + Stair.HEIGHT / 8,
			// 	Stair.WIDTH / 2 - Stair.HEIGHT / 4, Stair.HEIGHT / 2 + Stair.HEIGHT / 8,
			// ]
			for (let surface = 0; surface < 4; surface++) {
				let points: number[] = [
					// Stair.WIDTH / 2 - surface * Stair.HEIGHT / 4, Stair.HEIGHT / 2 - surface * Stair.HEIGHT / 8,
					// 0 - surface * Stair.HEIGHT / 4, Stair.HEIGHT - surface * Stair.HEIGHT / 8, ,
					// 0 - Stair.HEIGHT / 4 - surface * Stair.HEIGHT / 4, Stair.HEIGHT - Stair.HEIGHT / 8 - surface * Stair.HEIGHT / 8,
					// Stair.WIDTH / 2 - Stair.HEIGHT / 4 - surface * Stair.HEIGHT / 4, Stair.HEIGHT / 2 - Stair.HEIGHT / 8 - surface * Stair.HEIGHT / 8,
					// 0 - surface * Stair.HEIGHT / 4, 0 - surface * Stair.HEIGHT / 8, ,
					// 0 - Stair.HEIGHT / 4 - surface * Stair.HEIGHT / 4, 0 + Stair.HEIGHT / 8 - surface * Stair.HEIGHT / 8,
					// Stair.WIDTH / 2 - Stair.HEIGHT / 4 - surface * Stair.HEIGHT / 4, Stair.HEIGHT / 2 + Stair.HEIGHT / 8 - surface * Stair.HEIGHT / 8,
				]

				if (points) {
					this.drawPoints(points, undefined)
				}



			}
		}
		/*points = [
			Stair.WIDTH / 3, Stair.HEIGHT / 2,
			Stair.WIDTH / 2.5, Stair.HEIGHT / 2.5,
			Stair.WIDTH / 2, Stair.HEIGHT / 2,
			Stair.WIDTH / 2.5, Stair.HEIGHT
		]
			} else if (surface === 1 && direction === Directions.EAST) {
				// points = [
				// 	Stair.WIDTH / 2, 					Stair.HEIGHT,
				// 	Stair.WIDTH, 						Stair.HEIGHT / 2,
				// 	Stair.WIDTH + Stair.WIDTH / 2, 		Stair.HEIGHT / 5,
				// ]
			} */	}

	private drawPoints(points: number[], strokePoints: { x: number, y: number }[]) {
		this.drawPolygon(points)

		// strokePoints.forEach((point, index) => {
		// 	if (index === 0) {
		// 		this.moveTo(point.x, point.y)
		// 	} else {
		// 		this.lineTo(point.x, point.y)
		// 	}
		// })
	}
}