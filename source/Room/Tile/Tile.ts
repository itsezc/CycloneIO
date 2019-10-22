import { Container, Graphics, Texture, Sprite, Matrix, BaseTexture, Rectangle } from 'pixi.js-legacy'

import { Converter } from '../../utils/converter'

import { isObject } from 'util'
import { Room } from '../Room'

export class TileContent extends Container {
    texture: Sprite
    graphics: Tile
    type: any
    hasTexture: boolean
    constructor(type: any, x: any, y: any, id: any, moodlight: any, room: Room) {
        super()
        this.type = type
        this.hasTexture = true
        this.graphics = new Tile({type : type, position : {x : 0, y : 0}, dimension : {width : 64, height : 32}, room : room, })
    }
}

export class Tile extends Graphics {

    constructor(data:any) {
        super()
        this.position = data.position
        this.dimension = data.dimension
        this.type = data.type
        this.x = this.position.x
        this.y = this.position.y
        this.POINTS = []
        this.thickness = 8
        this.settings = {
            surface: 0x989865,
            right: 0x6f6f49,
            left: 0x838357,
            texture: false
        }
        this.interactive = true
        this.draw()
        this.registerEvents()
    }


    drawBorder(points:any, center:any = false, reverse:any = false, center2:any = false) {
        let borderRight, borderLeft
        if (center == false) {
            borderRight = [
                points[2], points[3],
                points[2], points[3] + this.thickness,
                points[4], points[5] + this.thickness,
                points[4], points[5]
            ]

            borderLeft = [
                points[6], points[7],
                points[6], points[7] + this.thickness,
                points[4], points[5] + this.thickness,
                points[4], points[5]
            ]
        } else {
            borderRight = [
                points[10], points[11],
                points[10], points[11] + this.thickness,
                points[8], points[9] + this.thickness,
                points[8], points[9]
            ]
            borderLeft = [
                points[6], points[7],
                points[6], points[7] + this.thickness,
                points[8], points[9] + this.thickness,
                points[8], points[9]
            ]
        }



        if (center == false) {
            this.beginFill(this.settings.right)
            this.drawPolygon(borderLeft)
            this.endFill()

            if (reverse) {
                this.beginFill(this.settings.right)
            } else {
                this.beginFill(this.settings.left)
            }
            this.drawPolygon(borderRight)
            this.endFill()

        } else {
            this.beginFill(this.settings.right)
            this.drawPolygon(borderRight)
            this.endFill()
            if (center2) {
                if (reverse) {
                    this.beginFill(this.settings.left)
                } else {
                    this.beginFill(this.settings.right)
                }
            } else {
                if (reverse) {
                    this.beginFill(this.settings.left)
                } else {
                    this.beginFill(this.settings.right)
                }
            }

            this.drawPolygon(borderLeft)
            this.endFill()
        }
    }


    drawSurface() {
        if (this.type == 'normal_tile') {
            this.POINTS = [
                0, 0,
                this.dimension.width / 2, this.dimension.height / 2,
                0, this.dimension.height,
                -this.dimension.width / 2, this.dimension.height / 2
            ]

            this.beginFill(this.settings.surface)
            this.drawPolygon(this.POINTS)
            this.hitArea = new Polygon(this.POINTS)
        } else if (this.type == 'left' || this.type == 'right') {
            let heightmap = [3, 2, 1, 0]
            let cartSurfaceUnit = [
                0, 0,
                8, 0,
                8, 32,
                0, 32
            ]
            let isoSurfaceUnit = []
            let count = 0
            for (let i = 0; i < cartSurfaceUnit.length; i += 2) {
                let isoPoint = Converter.cartesianToIsometric({ x: cartSurfaceUnit[i], y: cartSurfaceUnit[i + 1] })
                isoSurfaceUnit.push(isoPoint.x)
                isoSurfaceUnit.push(isoPoint.y)
            }

            for (let i = 0; i < heightmap.length; i += 1) {
                this.beginFill(this.settings.surface)
                this.lineStyle(0.5, 0x8e8e5e)
                let nPoint = [
                    isoSurfaceUnit[0] + (8) * i, isoSurfaceUnit[1] + (8 + 8 / 2) * i,
                    isoSurfaceUnit[2] + (8) * i, isoSurfaceUnit[3] + (8 + 8 / 2) * i,
                    isoSurfaceUnit[4] + (8) * i, isoSurfaceUnit[5] + (8 + 8 / 2) * i,
                    isoSurfaceUnit[6] + (8) * i, isoSurfaceUnit[7] + (8 + 8 / 2) * i
                ]

                this.drawPolygon(nPoint)
                this.endFill()
                if (this.type == 'left') {
                    this.drawBorder(nPoint, false, true)
                } else {
                    this.drawBorder(nPoint)
                }
            }
            this.tile_data = isoSurfaceUnit
            this.hitArea = new Polygon([0, 0, this.dimension.width / 2, this.dimension.height / 2, 0, this.dimension.height, - this.dimension.width / 2, this.dimension.height / 2])

            if (this.type == 'left') {
                this.scale.x = -1
            }
        } else if (this.type == 'center' || this.type == 'center-right' || this.type == 'center-left') {
            let components = []
            let type = this.type

            if (type == 'center') {

                components.push([0, 0, 8, 0, 8, 8, 0, 8])

                components.push([0, 8, 8, 8, 8, 0, 16, 0, 16, 16, 0, 16])

                components.push([0, 16, 16, 16, 16, 0, 24, 0, 24, 24, 0, 24])

                components.push([0, 24, 24, 24, 24, 0, 32, 0, 32, 32, 0, 32])
            } else {

                components.push([32, 0, 24, 0, 24, 8, 32, 8, 32, 0])

                components.push([24, 0, 24, 8, 32, 8, 32, 16, 16, 16, 16, 0])

                components.push([16, 0, 16, 16, 32, 16, 32, 24, 8, 24, 8, 0])

                components.push([8, 0, 8, 24, 32, 24, 32, 32, 0, 32, 0, 0])

            }

            let isometricComponents = []

            for (let i = 3; i >= 0; i -= 1) {
                let nIPoint = []
                for (let a = 0; a < components[i].length; a += 2) {
                    let nPoint = Converter.cartesianToIsometric({ x: components[i][a], y: components[i][a + 1] })
                    nIPoint.push(nPoint.x)
                    nIPoint.push(nPoint.y)
                }
                isometricComponents.push(nIPoint)
            }

            for (let i = 0; i < isometricComponents.length; i += 1) {
                let nPoint = []

                for (let a = 0; a < isometricComponents[i].length; a += 2) {
                    nPoint.push(isometricComponents[i][a])
                    nPoint.push(isometricComponents[i][a + 1] - (8 * i))
                }

                if (i == 3) {

                    this.drawBorder(nPoint)
                } else {
                    if (this.type == 'center-right' || this.type == 'center') {
                        this.drawBorder(nPoint, true, true)
                    } else {
                        this.drawBorder(nPoint, true, false, true)
                    }

                }

                this.beginFill(this.settings.surface)
                this.lineStyle(0.5, 0x8e8e5e)
                this.drawPolygon(nPoint)
                this.endFill()
            }

            if (this.type == 'center-right') {
                this.scale.x = -1
            }

            this.tile_data = isometricComponents

            return components
        }
    }

    registerEvents() {
        this.on('pointerover', (event) => {
            this.clear()
            this.settings.surface = 0xFFFFFF
            console.log('Hello')
            this.draw()
        })

        this.on('pointerout', (event) => {
            this.clear()
            this.settings.surface = 0xFF
            this.draw()
        })

        this.on('pointertap', (event) => {
            console.log(this.x, this.y)
            this.room.drawPath(this.coord)
        })
    }

    draw() {
        this.drawSurface()
    }

}
