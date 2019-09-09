import * as PIXI from 'pixi.js-legacy'

import RoomScene from '../RoomScene'
import Directions from '../map/directions/Directions'

export default class StairGenerator extends PIXI.Graphics {
    private readonly stairThickness: number

    constructor(private readonly room: RoomScene) {
        super()

        this.room = room
        this.stairThickness = this.room.roomData.floorThickness

        this.generateStairTextures()
    }

    private generateStairTextures() {
        const scaleMode = PIXI.SCALE_MODES.NEAREST
        const resolution = 1

        for (let dir = 0; dir < 5; dir++) {
            let direction: number

            switch (dir) {
                case 0:
                    direction = Directions.EAST
                    break

                case 1:
                    direction = Directions.SOUTH_EAST
                    break

                case 2:
                    direction = Directions.SOUTH
                    break

                case 3:
                    direction = Directions.SOUTH_WEST
                    break

                case 4:
                    direction = Directions.WEST
                    break
            }

            this.generateSurface(scaleMode, resolution, direction)
            this.clear()
        }
    }

    private generateSurface(scaleMode: PIXI.SCALE_MODES, resolution: number, direction: Directions) {
        this.drawSurface(direction)

        const texture = this.generateCanvasTexture(scaleMode, resolution)

        PIXI.Texture.addToCache(texture, `stair_${direction}`)
    }

    private drawSurface(direction: Directions) {
        let points: number[],
            color = 0x989865,
            strokeColor = 0x8e8e5e

        switch (direction) {
            case Directions.EAST:
                break
        }

        this.beginFill(color)
        this.lineStyle(1, strokeColor)
    }

    private drawPoints(points: number[], strokePoints: { x: number, y: number }[]) {
        this.drawPolygon(points)

        strokePoints.forEach((point, index) => {
            if (index === 0) {
                this.moveTo(point.x, point.y)
            } else {
                this.lineTo(point.x, point.y)
            }
        })
    }
}