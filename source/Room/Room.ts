import { Container, Graphics } from 'pixi.js-legacy'

import { Tile, TileContent } from './Tile/Tile'

import { Converter } from '../utils/converter'
import { Wall } from './Wall/Wall'
import { Path } from '../Pathfinder/Pathfinder'

import * as RoomModels from '../Room/models/models.json'

export class Room {
    mostSuperiorWall: any = { right: undefined, left: undefined }

    mostSuperiorHeightmap: any = { right: 0, left: 0 }

    tileContainer: Container

    doorTileContainer : Container

    textureContainer: Container

    wallContainer: Container

    tiles: any = []

    path: any = undefined

    heightmap: any

    moodlight: any = { active: false, color: 0xff }

    doorTile: any = { x: 0, y: 11 }

    userCoord : any 

    constructor(model: any) {
        this.heightmap = this.getHeightMap(RoomModels[model].id)
        this.tileContainer = new Container()
        this.textureContainer = new Container()
        this.doorTileContainer = new Container()
        this.wallContainer = new Container()
        this.draw()
    }

    heightmapConverter(oldHeightMap: any, doorTile: any) {
        let newHeightMap = []
        for (let i = 0; i < oldHeightMap.length; i += 1) {

            let y = oldHeightMap[i].split('')
            for (let a = 0; a < y.length; a += 1) {
                if (y[a] != 'x') {
                    let b = y[a]
                    y[a] = '0123456789abcdefghijklmnopqrst'.indexOf(y[a])
                    
                    if (i == parseInt(doorTile.y) && a == parseInt(doorTile.x)) {
                        console.log("DOORTILE !!!")
                        y[a] = "x"
                    }
                }
            }
            newHeightMap.push(y)
        }
        console.log(newHeightMap)
        return newHeightMap
    }

    getHeightMap(model: any) {
        let modelData: any;
        for (let i in RoomModels) {
            if (RoomModels[i].id == model) {
                modelData = RoomModels[i]
                console.log(modelData)
                break
            }
        }
        this.doorTile.x = parseInt(modelData.door_x)
        this.doorTile.y = parseInt(modelData.door_y)
        
        console.log(this.doorTile)
        modelData.heightmap = this.heightmapConverter(modelData.heightmap.split('\r\n'), { x: modelData.door_x, y: modelData.door_y })
        this.doorTile.z = parseInt(modelData.heightmap[this.doorTile.y][this.doorTile.x + 1])
        return modelData.heightmap
    }

    changeRoom(model: any) {
        this.heightmap = this.getHeightMap(RoomModels[model].id)
        this.tileContainer = new Container()
        this.textureContainer = new Container()
        this.wallContainer = new Container()
        this.mostSuperiorWall = { right: undefined, left: undefined }
        this.tiles = []
        this.path = undefined
        this.doorTileContainer = new Container()

        this.mostSuperiorHeightmap = { right: 0, left: 0 }
        this.draw()
    }

    draw() {
        for (let i = 0; i < this.heightmap.length; i += 1) {
            for (let a = 0; a < this.heightmap[i].length; a += 1) {
                if (this.heightmap[i][a] != 'x' || (this.doorTile.x == a && this.doorTile.y == i)) {
                    let heightZone = null
                    if(this.doorTile.x == a && this.doorTile.y == i){
                        heightZone = this.doorTile.z
                    }else{
                        heightZone = this.heightmap[i][a]
                    }
                    let tile = new TileContent(this.findTilesType({ x: a, y: i }, heightZone), a, i, 1, this.moodlight, this)
                    let wall = new Wall(this.moodlight)
                    let position = Converter.cartesianToIsometric({ x: a * 32, y: i * 32 })

                    tile.x = tile.graphics.x = wall.wallGraphics.x = position.x
                    tile.y = tile.graphics.y = wall.wallGraphics.y = tile.type == 'left' || tile.type == 'right' ? position.y - 24 - heightZone * 32 : position.y - heightZone * 32
                    if(this.doorTile.x == a && this.doorTile.y == i){
                        this.doorTileContainer.addChild(tile.graphics)
                    }else{
                        this.tileContainer.addChild(tile.graphics)
                    }
                    this.tiles.push(tile.graphics)
                    this.textureContainer.addChild(tile)
                    let walls = this.checkWallEligibility({ x: a, y: i })
                    if (walls.left || walls.right) {
                        this.wallContainer.addChild(wall.wallGraphics)
                        if (tile.type == 'left' || tile.type == 'right') {
                            wall.wallGraphics.y += 24
                        }
                        if (walls.left) {
                            wall.wallGraphics.scale.x = -1
                        }
                        if (walls.right && walls.left) {
                            let secondWall = new Wall(this.moodlight)
                            secondWall.wallGraphics.x = wall.wallGraphics.x
                            secondWall.wallGraphics.y = wall.wallGraphics.y
                            this.wallContainer.addChild(secondWall.wallGraphics)
                            secondWall.dimension.height += (this.mostSuperiorHeightmap.left - this.heightmap[i][a]) * 32
                            secondWall.draw()
                        }
                        if (walls.left) {
                            wall.color = 0xbbbedd

                        }

                        wall.dimension.height += (this.mostSuperiorHeightmap.left - this.heightmap[i][a]) * 32

                        if(walls.doorTile){
                            wall.dimension.height -= 87
                            wall.wallGraphics.y -= 87
                        }
                        wall.draw()
                    }

                } else {
                    let tile = new Graphics()
                    this.tileContainer.addChild(tile)
                    this.tiles.push(tile)
                }
            }
        }
        this.heightmap[this.doorTile.y][this.doorTile.x ] = this.doorTile.z
    }

    getTilesAround(position: any) {
        let tileAround: any = { east: undefined, west: undefined, north: undefined, south: undefined, north_west: undefined, north_east: undefined, south_west: undefined, south_east: undefined }
        tileAround.north = this.heightmap[position.y - 1] != undefined ? this.heightmap[position.y - 1][position.x] : undefined
        tileAround.south = this.heightmap[position.y + 1] != undefined ? this.heightmap[position.y + 1][position.x] : undefined
        tileAround.north_west = this.heightmap[position.y - 1] != undefined && this.heightmap[position.y][position.x - 1] != undefined ? this.heightmap[position.y - 1][position.x - 1] : undefined
        tileAround.north_east = this.heightmap[position.y - 1] != undefined && this.heightmap[position.y][position.x + 1] != undefined ? this.heightmap[position.y - 1][position.x + 1] : undefined
        tileAround.south_west = this.heightmap[position.y + 1] != undefined && this.heightmap[position.y][position.x - 1] != undefined ? this.heightmap[position.y + 1][position.x - 1] : undefined
        tileAround.south_east = this.heightmap[position.y + 1] != undefined && this.heightmap[position.y][position.x + 1] != undefined ? this.heightmap[position.y + 1][position.x + 1] : undefined
        tileAround.east = this.heightmap[position.y][position.x + 1] != undefined ? this.heightmap[position.y][position.x + 1] : undefined
        tileAround.west = this.heightmap[position.y][position.x - 1] != undefined ? this.heightmap[position.y][position.x - 1] : undefined
        if (tileAround.south_west == 1) { }
        return tileAround
    }

    findTilesType(position: any, heightmap: any) {
        let tileAround = this.getTilesAround(position)
        let type = 'normal_tile'

        if (tileAround.north == heightmap) {
            if (tileAround.north_east == heightmap + 1) {
                type = 'center-left'
            } else if (tileAround.north_west == heightmap + 1) {
                type = 'center'
            }
        } else if (tileAround.north == heightmap + 1) {
            type = 'left'
        }

        if (tileAround.south == heightmap) {
            if (tileAround.south_west == heightmap + 1) {
                type = 'center-right'
            }
        }

        if (tileAround.west == heightmap + 1) {
            type = 'right'
        }

        if(tileAround.south == heightmap + 1){
            return type = 'top-right'
        }
        if(tileAround.west == heightmap-1){
            return type = 'top-left'
        }

        return type
    }

    checkWallEligibility(position: any) {
        let wallValidity: any = { right: true, left: true, doorTile: false }
        
        if (position.y == this.doorTile.y && position.x == this.doorTile.x) {

            return { right: false, left: false, doorTile: true }
        }
        let y = position.y

        if(position.x == this.doorTile.x + 1 && position.y == this.doorTile.y){
            wallValidity.doorTile = true
        }
        if (this.mostSuperiorWall.right == undefined && wallValidity.doorTile == false) {
            this.mostSuperiorWall.right = y
            this.mostSuperiorHeightmap.right = this.heightmap[y][position.x]
        }
        while (this.heightmap[y - 1] != undefined && this.mostSuperiorWall.right < position.y) {
            if (this.heightmap[y - 1][position.x] != 'x') {
                wallValidity.right = false
                break
            } else {

            }
            y -= 1
        }
        y = position.y
        let x = position.x
        if (wallValidity.right) {
            while (this.heightmap[y][x - 1] != undefined) {
                while (this.heightmap[y - 1] != undefined) {
                    if (this.heightmap[y - 1][x - 1] != 'x') {
                        return false
                    } else {

                    }
                    y -= 1
                }
                y = position.y
                x -= 1
            }
            wallValidity.right = true
        }
        x = position.x
        if (this.mostSuperiorWall.left == undefined && wallValidity.doorTile == false) {
            this.mostSuperiorWall.left = x
            this.mostSuperiorHeightmap.left = this.heightmap[y][x]
        }


        y = position.y
        x = position.x

        while (this.heightmap[y][x - 1] != undefined) {
            if (this.heightmap[y][x - 1] == 'x') {

            } else {
                wallValidity.left = false
                break
            }
            x -= 1
        }
        if (wallValidity.left) {
            while (this.heightmap[y - 1] != undefined) {
                while (this.heightmap[y - 1][x - 1] != undefined) {
                    if (this.heightmap[y - 1][x - 1] == 'x') {

                    } else {
                        wallValidity.left = false
                        break
                    }
                    x -= 1
                }
                x = position.x
                y -= 1
            }
        }

        

        return wallValidity
        //console.log(this.checkActualRightValididy(position))
    }

    drawPath(destination: any) {
        if (this.path != undefined) {

            for (let i = 0; i < this.path.path.length; i += 1) {
                let mPath = this.path.path[i]
                let index = mPath.y * this.heightmap[0].length + mPath.x
                let tile = this.tiles[index]
                tile.clear()
                tile.settings.surface = 0x989865
                tile.draw()
            }
        }
        let path = new Path(this.heightmap, {x : this.userCoord.x, y: this.userCoord.y}, destination)

        for (let i = 0; i < path.path.length; i += 1) {
            let mPath = path.path[i]
            let index = mPath.y * this.heightmap[0].length + mPath.x
            let tile = this.tiles[index]
            console.log(tile)
            tile.clear()
            tile.settings.surface = 0x3f51b5
            tile.draw()
            console.log('Drw', i, path.path.length)
        }
        this.path = path
    }
}