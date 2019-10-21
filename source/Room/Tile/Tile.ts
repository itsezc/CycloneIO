import { Container, Graphics, Texture, Sprite, Matrix, BaseTexture, Rectangle } from 'pixi.js-legacy'

import { Converter } from '../../utils/converter'

import { isObject } from 'util'
import { Room } from '../Room'

const tileTexture = {
    white: {
        texture: new BaseTexture('floor_texture.png')
    },
    red: {
        texture: new BaseTexture('floor_red.png')
    }
}

export class TileTexture {
    unit: any = []
    constructor(texture: BaseTexture, split: any) {
        if (split == 4) {
            for (let i = 0; i < 2; i += 1) {
                for (let a = 0; a < 2; a += 1) {
                    this.unit.push(Sprite.from(new Texture(texture, new Rectangle(a * 32, i * 32, 32, 32))))
                }
            }
        }

    }
}

export class TileContent extends Container {
    texture: Sprite
    graphics: Tile
    type: any
    hasTexture: boolean
    isometricMatrix: any = new Matrix(Math.cos(Math.PI * 26.869 / 180), Math.sin(Math.PI * 26.869 / 180), Math.cos(Math.PI * 153.131 / 180), Math.sin(Math.PI * 153.131 / 180))
    constructor(type: any, x: any, y: any, id: any, moodlight: any, room: Room) {
        super()

        this.type = type
        this.hasTexture = true
        this.graphics = new Tile(type, { texture: true, type: "white" }, moodlight, { x: x, y: y }, room)

        let texture = new TileTexture(tileTexture.white.texture, 4)
        let borderLeftTexture = new Texture(tileTexture.white.texture, new Rectangle(2, 0, 32, 8))

        let image
        if (x % 2 == 1 && y % 2 == 1) {
            image = texture.unit[0]
        } else if (x % 2 == 0 && y % 2 == 1) {
            image = texture.unit[1]
        } else if (x % 2 == 0 && y % 2 == 0) {
            image = texture.unit[2]
        } else {
            image = texture.unit[3]
        }
        if (this.graphics.type == 'normal_tile') {
            image.tint = 0xd4d4d4

            image.width = 36
            image.height = 36
            this.texture = image
            if (this.graphics.type == 'normal_tile') {
                this.addChild(image)
                image.transform.setFromMatrix(this.isometricMatrix)
            }

            let borderLeftImage = Sprite.from(borderLeftTexture)
            borderLeftImage.transform.setFromMatrix(new Matrix(Math.cos(Math.PI * 26.875 / 180), Math.sin(Math.PI * 26.875 / 180), Math.cos(Math.PI * 90 / 180), Math.sin(Math.PI * 90 / 180)))
            borderLeftImage.x = -this.graphics.tile_data[2]
            borderLeftImage.width = 36
            borderLeftImage.height = 8
            borderLeftImage.y = this.graphics.tile_data[3]

            let borderRightImage = Sprite.from(borderLeftTexture)
            borderRightImage.transform.setFromMatrix(new Matrix(Math.cos(Math.PI * -26.875 / 180), Math.sin(Math.PI * -26.875 / 180), Math.cos(Math.PI * 90 / 180), Math.sin(Math.PI * 90 / 180)))
            borderRightImage.x = -this.graphics.tile_data[4]
            borderRightImage.width = 36
            borderLeftImage.height = 8
            borderRightImage.y = this.graphics.tile_data[5]
            this.addChild(borderRightImage)
            this.addChild(borderLeftImage)

        }

    }
}

export class Tile extends Graphics {
    dimension: any = {
        width: 64, height: 32
    }
    TILE_POINT: any = [
        0, 0,
        this.dimension.width / 2, this.dimension.height / 2,
        0, this.dimension.height,
        -this.dimension.width / 2, this.dimension.height / 2
    ]
    id: any
    coord: any
    thickness: any = 8
    type: any
    room: Room
    tile_data: any
    settings: any = {
        surface: 0x989865,
        right: 0x6f6f49,
        left: 0x838357,
        texture: false
    }
    constructor(type: any, settings: any, moodlight: any, coord: any, room: any) {
        super()
        this.type = type
        this.coord = coord
        this.room = room
        this.draw()
        this.registerEvents()

        if (moodlight.active) {
            this.tint = moodlight.color
        }


    }

    clearl() {
        this.clear()
    }

    registerEvents() {
        this.interactive = true
        this.on('pointerover', (event: any) => {
            this.clear()
            this.draw()
            this.beginFill(0xFFFFFF)
            this.drawPolygon(this.TILE_POINT)
            this.endFill()
        })

        this.on('pointerout', (event: any) => {
            this.clear()
            this.draw()
        })

        this.on('pointertap', (event: any) => {
            console.log(this.coord)
            this.room.drawPath(this.coord)
        })
    }

    drawSurface() {
        this.beginFill(this.settings.surface)
        this.lineStyle(0.5, 0x8e8e5e)
        this.drawPolygon(this.TILE_POINT)
        this.endFill()
    }

    drawBorder(points: any, center: any = false, reverse: any = false, center2: any = false) {
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

    drawStair(type: any) {
        if (type == 'left' || type == 'right') {
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
                if (type == 'left') {
                    this.drawBorder(nPoint, false, true)
                } else {
                    this.drawBorder(nPoint)
                }

            }
            this.tile_data = isoSurfaceUnit

            if (type == 'left') {
                this.scale.x = -1
            }
        } else if (type == 'center' || type == 'center-right' || type == 'center-left') {
            let components = []

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
        } else {
            let heightmap = [3, 2, 1, 0]
            let cartSurfaceUnit = [
                0, 0,
                0, 8,
                32, 8,
                32, 0
            ]
            let isoSurfaceUnit = []
            let count = 0
            for (let i = 0; i < cartSurfaceUnit.length; i += 2) {
                let isoPoint = Converter.cartesianToIsometric({ x: cartSurfaceUnit[i], y: cartSurfaceUnit[i + 1] })
                isoSurfaceUnit.push(isoPoint.x)
                isoSurfaceUnit.push(isoPoint.y)
            }

            for (let i = 3; i >= 0; i -= 1) {
                this.beginFill(this.settings.surface)
                this.lineStyle(0.5, 0x8e8e5e)
                let nPoint = [
                    isoSurfaceUnit[0] + (8) * i - 24, isoSurfaceUnit[1] + (8 / 2) * i + 12 - 24,
                    isoSurfaceUnit[2] + (8) * i - 24, isoSurfaceUnit[3] + (8 / 2) * i + 12 - 24,
                    isoSurfaceUnit[4] + (8) * i - 24, isoSurfaceUnit[5] + (8 / 2) * i + 12 - 24,
                    isoSurfaceUnit[6] + (8) * i - 24, isoSurfaceUnit[7] + (8 / 2) * i + 12 - 24
                ]
                
                this.drawPolygon(nPoint)
                this.drawBorder(nPoint)
                this.endFill()
            }

            if (type == 'top-left') {
                this.scale.x = -1
            }
        }
    }



    draw() {
        if (this.type == 'normal_tile') {
            this.drawSurface()
            this.drawBorder(this.TILE_POINT)
            this.tile_data = this.TILE_POINT
        } else {
            this.drawStair(this.type)
        }
    }
}