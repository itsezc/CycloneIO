import { Pixi } from './Pixi.js'

import { Tile } from './tile.js'

import { Wall } from './wall.js'

import { Converter } from './converter.js'

const { Container } = Pixi

export class Room extends Container {

    constructor(heightmap){
        super()
        this.heightmap = this.getHeightValue(heightmap.split('\r\n'))
        this.tileContainer = new Container()
        this.wallContainer = new Container()
        this.doorTile = {x : 0, y : 15}
        this.heightmap[this.doorTile.y][this.doorTile.x] = 'x'
        this.mostSuperiorWall = { right : undefined, left : undefined }
        this.mostSuperiorHeightmap = { right : undefined, left : undefined }
        this.drawTiles()
        this.drawWall()
        console.log(this.heightmap)
    }

    getHeightValue(map){
        let heightmap = []
        for(let y = 0; y < map.length; y += 1){
            heightmap.push([])
            for(let x = 0; x < map[y].length; x +=1 ){
                if (map[y][x] != 'x') heightmap[heightmap.length - 1].push(this.getHeightStringValue(map[y][x]))
                else heightmap[heightmap.length - 1].push('x')
            }
        }
        return heightmap
    }

    drawTiles(){
        for(let y = 0; y < this.heightmap.length; y += 1){
            for(let x = 0; x < this.heightmap[y].length; x += 1){
                let heightmap = this.heightmap[y][x]
                if(heightmap != 'x'){
                    let option = {
                        position : Converter.cartesianToIsometric({ x: x * 32, y: y * 32}),
                        dimension : { width : 64, height : 32},
                        type : this.findTilesType({x : x, y : y}, heightmap),
                        room : this
                    }
                    let tile = new Tile(option)
                        tile.y -= heightmap * 32 
                    this.tileContainer.addChild(tile)
                }
            }
        }
    }

    drawWall(){
        for(let y = 0; y < this.heightmap.length; y += 1){
            for(let x = 0; x < this.heightmap[y].length; x += 1){
                let heightmap = this.heightmap[y][x]
                if(heightmap != 'x'){
                    let tileAround = this.getTilesAround({x : x, y : y})
                    let wall = this.checkWallEligibility({x : x, y : y})
                    for(let wallType in wall){
                        if(wall[wallType]){
                            let option = {
                                color : wallType == 'right' ? 0xbbbedd : 0x91939f,
                                reverse : wallType == 'right' ? 1 : -1,
                                position : Converter.cartesianToIsometric({ x: x * 32, y: y * 32 }),
                                dimension : {
                                    height : (this.mostSuperiorHeightmap.left - this.heightmap[y][x]) * 32
                                }
                            }
                            let wall = new Wall(option)
                                wall.wallGraphics.y -= heightmap * 32 
                            this.wallContainer.addChild(wall.wallGraphics)
                        }
                    }
                }
            }
        }
    }

    checkWallEligibility(position){
        let wallValidity = { right : true, left : true, doorTile : false }

        let y = position.y

        if (position.y == this.doorTile.y && position.x == this.doorTile.x) return { right: false, left: false, doorTile: true }

        if(position.x == this.doorTile.x + 1 && position.y == this.doorTile.y) wallValidity.doorTile = true

        if (this.mostSuperiorWall.right == undefined && wallValidity.doorTile == false) {
            this.mostSuperiorWall.right = y
            this.mostSuperiorHeightmap.right = this.heightmap[y][position.x]
        }

        while (this.heightmap[y - 1] != undefined && this.mostSuperiorWall.right < position.y) {
            if (this.heightmap[y - 1][position.x] != 'x') {
                wallValidity.right = false
                break
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
            if (this.heightmap[y][x - 1] != 'x') {
                wallValidity.left = false
                break
            }
            x -= 1
        }

        if (wallValidity.left) {
            while (this.heightmap[y - 1] != undefined) {
                while (this.heightmap[y - 1][x - 1] != undefined) {
                    if (this.heightmap[y - 1][x - 1] != 'x') {
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
    }

    getTilesAround(position) {
        let tileAround = { east: undefined, west: undefined, north: undefined, south: undefined, north_west: undefined, north_east: undefined, south_west: undefined, south_east: undefined }
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

    findTilesType(position, heightmap) {
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

    getHeightStringValue(string){
        return '0123456789abcdefghijklmnopqrstuvwxyz'.indexOf(string)
    }

}