import * as PIXI from 'pixi.js-legacy'

import RoomScene from '../RoomScene'
import Directions from '../map/directions/Directions'
import Stair from './Stair'

import HabboContainer from '../../injectors/HabboContainer'
import Habbo from '../../Habbo'

export default class StairGenerator extends PIXI.Graphics {
	public static readonly SURFACES = 4

	private readonly room: RoomScene
	private readonly renderer: PIXI.Renderer | PIXI.CanvasRenderer
	private readonly stairThickness: number

	public constructor(room: RoomScene) {
		super()

		this.room = room

		const game = HabboContainer.get(Habbo)

		this.renderer = game.renderer
		this.stairThickness = this.room.data.floorThickness

		this.generateStairTextures()
	}

	private generateStairTextures(): void {
		const scaleMode = PIXI.settings.SCALE_MODE
		const resolution = 1

		const possibleDirections = [Directions.NORTH_EAST, Directions.EAST, Directions.SOUTH_EAST, Directions.SOUTH,
									Directions.SOUTH_WEST, Directions.WEST, Directions.NORTH_WEST]

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
		this.drawBordersRight(direction)

		const texture = this.renderer.generateTexture(this, scaleMode, resolution)

		PIXI.Texture.addToCache(texture, `stair_${direction}`)
	}

	private drawSurfaces(direction: Directions, color: number = 0x989865) {
		this.beginFill(color)

		for (let surface = 0; surface < StairGenerator.SURFACES; surface++) {
			this.drawSurface(surface, direction)
		}
	}

	private drawSurface(surface: number, direction: Directions): void {
		let points: number[] = []
		let points2: number[] = []
		let points3: number[] = []
		let points4: number[] = []
		let points5: number[] = []
		let points6: number[] = []

		switch (direction) {

			case Directions.NORTH_EAST: {
				points = [
					0, 					0,
					Stair.WIDTH / 8, 	Stair.HEIGHT / 8,
					0, 					Stair.HEIGHT / 4
				]

				break
			}

			case Directions.EAST:
				points = [
					0, 					Stair.HEIGHT / 8,
					Stair.WIDTH / 8, 	Stair.HEIGHT / 4,
					Stair.WIDTH / 4, 	Stair.HEIGHT / 8,
					Stair.WIDTH / 8, 	0
				]

				if (surface > 0) {
					points.splice(8, 0, 0, -Stair.HEIGHT / 8, 0, Stair.HEIGHT / 8)
				}

				points = points.map((point, index) => {
					return point + surface * (index < 4 ? index & 1 ? Stair.HEIGHT / 4 + Stair.HEIGHT / 8 : Stair.WIDTH / 8
														: index & 1 ? Stair.HEIGHT / 4 : Stair.WIDTH / 4)
				})

				break

			case Directions.SOUTH_EAST:
				points = [
					0, 										Stair.HEIGHT / 2,
					Stair.WIDTH / 2, 						0,
					Stair.WIDTH / 2 + Stair.WIDTH / 8, 		Stair.HEIGHT / 8,
					Stair.WIDTH / 8, 						Stair.HEIGHT / 2 + Stair.HEIGHT / 8
				]

				points = points.map((point, index) => {
					return point + surface * (index & 1 ? Stair.HEIGHT / 4 + Stair.HEIGHT / 8 : Stair.WIDTH / 8)
				})

				break

			case Directions.SOUTH:
				points = [
					0, 	4,
					8, 	8,
					16, 4,
					8, 	0
				]

				points2 = [
					16, 12,
					28, 16,
					8, 20
				]
				break
		}

		if (points.length > 0) {
			console.log(points, surface)
		}

		this.drawPoints(points, undefined)
		this.drawPoints(points2, undefined)
		this.drawPoints(points3, undefined)
		this.drawPoints(points4, undefined)
		this.drawPoints(points5, undefined)
		this.drawPoints(points6, undefined)
	}

	private drawBordersRight(direction: Directions, rightBorder: boolean = false) {
		// const color = 0x6f6f49
		// //strokeColor = 0x676744

		// this.beginFill(color)

		// let borderEast1 = [
		// 	8, 8,
		// 	8, 16,
		// 	16, 12,
		// 	16, 4
		// ]

		// let borderEast2 = [
		// 	16, 20,
		// 	16, 28,
		// 	32, 20,
		// 	32, 12,
		// ]

		// let borderEast3 = [
		// 	24, 32,
		// 	24, 40,
		// 	48, 28,
		// 	48, 20
		// ]

		// let borderEast4: number[] = []

		// if (rightBorder) {
		// 	borderEast4 = [
		// 		32, 44,
		// 		32, 52,
		// 		64, 36,
		// 		64, 28
		// 	]
		// }

		// if (direction === Directions.EAST) {
		// 	this.drawPoints([borderEast1, borderEast2, borderEast3, borderEast4], undefined)
		// }
		//this.lineStyle(0.5, strokeColor)

		// for (let i = 0; i < 4; i += 1) {

		// }
	}

	private drawBordersLeft(direction: Directions) {
		// const color = 0x838357

		// this.beginFill(color)

		// let borderEast1 = [
		// 	0, 4,
		// 	8, 8,
		// 	8, 16,
		// 	0, 12
		// ]

		// let borderEast2 = [
		// 	8, 16,
		// 	16, 20,
		// 	16, 28,
		// 	8, 24
		// ]

		// let borderEast3 = [
		// 	16, 28,
		// 	24, 32,
		// 	24, 40,
		// 	16, 36
		// ]

		// let borderEast4 = [
		// 	24, 40,
		// 	32, 44,
		// 	32, 52,
		// 	24, 48
		// ]

		// if (direction === Directions.EAST) {
		// 	this.drawPoints([borderEast1, borderEast2, borderEast2, borderEast3, borderEast4], undefined)
		// }
	}

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
