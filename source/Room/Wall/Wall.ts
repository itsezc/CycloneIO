import { Container, Graphics, Sprite } from 'pixi.js-legacy'
import { isContext } from 'vm'

export class Wall extends Container{
    wallTexture : Sprite

    wallGraphics : Graphics

    dimension : any = {
        width : 64, height : 128
    }

    WALL_POINTS : any = [
        0, 0,
        this.dimension.width / 2, 16,
        this.dimension.width / 2, 16 - this.dimension.height,
        0, -this.dimension.height
    ]

    color:any = 0x91939f

    id : any

    coord : any

    thickness : any

    constructor(moodlight:any){
        super()
        this.wallGraphics = new Graphics()
        if(moodlight.active){
            this.wallGraphics.tint = moodlight.color
        }
        
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