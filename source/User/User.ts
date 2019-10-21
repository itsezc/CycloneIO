import { Container, Texture, Sprite } from "pixi.js";
import { Converter } from "../utils/converter";

export class User extends Container{
    path : any

    actualPath : any

    coord : any

    position : any

    moveTo : any

    texture : any

    frames : any = {
        wlk : 3,
        sit : 1, 
        wav : 2,
        std : 1,
    }

    sprites : any = {
        wlk : {
            0 : [],
            1 : [],
            2 : [],
            3 : [],
            7 : [],
        },
        sit : {
            0 : [],
            1 : []
        },
        wav : {
            0 : [],
            1 : [],
            2 : [],
            3 : [],
            7 : []
        },
        lay : {
            0 : [],
            1 : []
        },
        std : {
            0 : [],
            1 : [],
            2 : [],
            3 : [],
            7 : []
        }
    }

    sprite : any
    heightmap:any

    constructor(figure:any, coord : any, heightmap:any){
        super()
        this.coord = coord
        this.heightmap = heightmap
        this.loadTexture('ca-1815-92.sh-290-62.hd-180-1009.ch-262-64.ha-3763-63.lg-280-1193.hr-831-54')
        this.initializePosition()
    }

    initializePosition(){
        this.sprite = this.sprites["std"][2][0]
        let position =  Converter.cartesianToIsometric({x : this.coord.x * 32, y : this.coord.y * 32})
        this.sprite.x = position.x - 32
        this.sprite.y = position.y - 83 - 32 * this.heightmap[this.coord.y][this.coord.x]+ 1
        this.position = position
    }

    updatePosition(){
        let position =  Converter.cartesianToIsometric({x : this.coord.x * 32, y : this.coord.y * 32})
        this.sprite.x = position.x - 32
        this.sprite.y = position.y - 83 - 32 * this.heightmap[this.coord.y][this.coord.x]
        this.position = position
    }

    loadTexture(figure:any){
        for(let sprite in this.sprites){
            let animation = sprite
            let keys = Object.keys(this.sprites[animation])
            for(let i = 0; i < keys.length; i += 1){
                let frames = 0
                while(frames < this.frames[animation]){
                    console.log(i)
                    let texture = Texture.from('https://www.habbo.com/habbo-imaging/avatarimage?figure='+figure+'&direction='+keys[i]+"&head_direction="+keys[i]+"&animation="+animation+"&frame="+frames)
                    this.sprites[animation][keys[i]].push(Sprite.from(texture))
                    let copy = Sprite.from(texture)
                    copy.scale.x = -1
                    if(i == 0){
                        if(this.sprites[animation]["6"] == undefined){
                            this.sprites[animation]["6"] = []
                        }
                        
                        this.sprites[animation]["6"].push(copy)
                    }else if( i == 1){
                        if(this.sprites[animation]["5"] == undefined){
                            this.sprites[animation]["5"] = []
                        }
                        
                        this.sprites[animation]["5"].push(copy)
                    }else if( i == 2){
                        if(this.sprites[animation]["4"] == undefined){
                            this.sprites[animation]["4"] = []
                        }
                        
                        this.sprites[animation]["4"].push(copy)
                    }
                    frames += 1
                }
            }

        }
        console.log(this.sprites)
    }

    update(){
        
    }


}