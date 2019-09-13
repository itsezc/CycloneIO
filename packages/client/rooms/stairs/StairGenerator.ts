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
            let size = {width : Stair.WIDTH,height : Stair.HEIGHT}
            let margin = { x: 0, y : 0}
            for(let i = 0; i < 4; i += 1){
                let points = [
                    margin.x, margin.y,
                    margin.x + size.width / 2, margin.y + 0 + size.height / 2 ,
                    margin.x, size.height + margin.y ,
                    margin.x - size.width / 2, margin.y + size.height / 2 
                ]

                margin.x -= size.width / 8
                margin.y -= size.width / 8
                size.width -= (Stair.WIDTH / 4)
                size.height -= (Stair.HEIGHT / 4)
                this.drawPolygon(points)
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
