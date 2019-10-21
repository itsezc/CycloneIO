import { Application, Sprite, Texture, Container, Graphics } from 'pixi.js-legacy'

import { Tile } from './Room/Tile/Tile'

import { Viewport } from 'pixi-viewport'

import * as Pathfinder from 'pathfinding'

import { Room } from './Room/Room'

import { Path } from './Pathfinder/Pathfinder'

import { User } from './User/User'
import { Avatar } from './imager/Avatar/AvatarImager'


const app = new Application()

const viewport = new Viewport().drag()

const color = [0xff0000, 0x4caf50, 0xff9800, 0xff5722, 0xffff]

const button = new Graphics()
button.interactive = true
let i = 0
let roomM = 0
button.beginFill(color[0])
button.drawRect(0, 0, 40, 40)
button.endFill()
button.on('pointertap', (event: any) => {
    button.clear()
    if (i + 1 < color.length) {
        i += 1
    } else {
        i = 0
    }
    button.beginFill(color[i])
    button.drawRect(0, 0, 40, 40)
    button.endFill()
    if(i < 28){
        roomM += 1
    }
    
    viewport.removeChild(room.wallContainer)
    viewport.removeChild(room.doorTileContainer)
    viewport.removeChild(room.tileContainer)
    viewport.removeChild(user.sprite)
    room.changeRoom(roomM)
    viewport.addChild(room.doorTileContainer)
    viewport.addChild(room.wallContainer)
    room.doorTileContainer.addChild(user.sprite)
    user.coord = room.doorTile
    user.heightmap = room.heightmap
    user.updatePosition()

    room.userCoord = user.coord


    
    viewport.addChild(room.tileContainer)
    
    
})

const room = new Room(0)



console.log(room.tiles)
console.log(room.tileContainer)

let user = new User("Hello", room.doorTile, room.heightmap)

room.userCoord = user.coord

window.setInterval(function(){
    if(room.path != undefined){
        if(user.coord.x == room.doorTile.x && user.coord.y == room.doorTile.y){
            room.doorTileContainer.removeChild(user.sprite)
            room.tileContainer.addChild(user.sprite)
            
        }
        if(room.path.path[room.path.path.length - 1] != undefined){
            user.coord = room.path.path[room.path.path.length - 1]
            room.userCoord = user.coord
            user.updatePosition()
        }
        
    
        room.path.path.pop()

    }
}, 200)



viewport.addChild(room.doorTileContainer)
viewport.addChild(room.wallContainer)
viewport.addChild(room.tileContainer)
let direction = 0
let eyeid = 0
let hairid = 0
let shirtid = 0


app.stage.addChild(viewport)
app.stage.addChild(button)


document.body.appendChild(app.view)
app.view.width = window.innerWidth
app.view.height = window.innerHeight