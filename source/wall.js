
import { Converter } from './converter.js'

import { Pixi } from './Pixi.js'

const { Graphics, Container } = Pixi

export class Wall extends Container{
    wallTexture 

    wallGraphics

    dimension = {
        width : 64, height : 128
    }

    WALL_POINTS = [
        0, 0,
        this.dimension.width / 2, 16,
        this.dimension.width / 2, 16 - this.dimension.height,
        0, -this.dimension.height
    ]

    color

    id

    coord

    thickness

    constructor(options){
        super()
        this.wallGraphics = new Graphics()
        this.color = options.color
        this.wallGraphics.scale.x = options.reverse
        this.wallGraphics.x = options.position.x
        this.wallGraphics.y = options.position.y
        this.dimension.height += options.dimension.height
        this.draw()
    }

    draw(){
        this.WALL_POINTS = [
            0, 0,
            this.dimension.width / 2, 16,
            this.dimension.width / 2, 16 - this.dimension.height,
            0, -this.dimension.height
        ]
        this.wallGraphics.clear()
        this.wallGraphics.beginFill(this.color)
        this.wallGraphics.drawPolygon(this.WALL_POINTS)
        this.wallGraphics.endFill()
    }
}