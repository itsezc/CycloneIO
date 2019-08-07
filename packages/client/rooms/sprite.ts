import * as Furniture from '../furniture/'
import Room from './room'
import FurnitureSprite from '../furniture/sprite'
import { GameObject } from '../games/object';

import Pathfinder, { DiagonalMovement } from 'pathfinding'
import { thisExpression } from 'babel-types';

export default class RoomSprite extends Phaser.GameObjects.Container {

    private heightmap: Array<Array<number>>

    public roomContainer: Phaser.GameObjects.Container
    public furnitureContainer: Phaser.GameObjects.Container

    public _scene: Room

    private static realTileWidth = 64
    private static realTileHeight = 32
    private static tileWidth = RoomSprite.realTileWidth / 2
    private static tileHeight = RoomSprite.realTileHeight / 2

    constructor(
        scene: Room,
        heightmap: number[][],
        private readonly door: [number, number]
    ) {
        super(scene)

        this.heightmap = heightmap;

        this._scene = scene

        this.roomContainer = new Phaser.GameObjects.Container(scene)
        this.furnitureContainer = new Phaser.GameObjects.Container(scene)

        this.add(this.roomContainer)
        this.add(this.furnitureContainer)

        this.initializeRoomHeightmap(this.roomContainer, this.door, this.heightmap)
    }


    /**
     * [
     * [
     * (0) (r)
     * 0, // c <-
     * 0,
     * 0
     * ],
     * [
     * 0,
     * 0,
     * 0 ]
     * ]
     */

    /**
     * 0, 0
     */
    private transpose(a: number[][]): any {
        return Object.keys(a[0]).map((c: any) => {
            return a.map((r: number[]): any => {
                return r[c];
            });
        });
    }

    private mirror(a: number[][]): any {
        return a.map((arr) => { return arr.reverse() })
    }

    private initializeRoomHeightmap(container: Phaser.GameObjects.Container, door: [number, number], heightmap: Array<Array<number>>) {
        /*
            let floorMaxY = heightmap.length
            let floorMaxX = heightmap[0].length

            let tileModules = floorMaxX

            let floorIndex = 0
        */

        heightmap = this.transpose(this.mirror(heightmap))

        console.log(heightmap)

        for (let y = 0;y < heightmap.length;y++) {
            // console.log('next row -1 ', heightmap[y - 1])
            // console.log('next row +1', heightmap[y + 1])

            for (let x = 0;x < heightmap[y].length;x++) {
                const tileData = heightmap[y][x]

                let screenX = this.getScreenX(x, y)
                let screenY = this.getScreenY(x, y)

                if (tileData !== -1) {

                    //console.log(this.getRightTile(heightmap, y, x))
                    //console.log(this.isRightStair(tileData, heightmap, y, x))
                    //console.log('bottom tile ', this.isTopStair(tileData, heightmap[y], x))

                    let floorSprite: Phaser.GameObjects.Image
                    let stairRight: Phaser.GameObjects.Image
                    let stairTopRight: Phaser.GameObjects.Image
                    let stairTopLeft: Phaser.GameObjects.Image
                    let stairLeft: Phaser.GameObjects.Image
                    let stairBottomLeft: Phaser.GameObjects.Image
                    let stairCenter: Phaser.GameObjects.Image
                    let stairBottomRight: Phaser.GameObjects.Image

                    if (this.isRightStair(tileData, heightmap, y, x)) {
                        stairRight = this._scene.add.image(screenX, screenY - (tileData * 32) - 7, 'stairs_right')
                        stairRight.setOrigin(0, 0)
                        stairRight.setInteractive({ pixelPerfect: true })
                    }

                    else if (this.isLeftStair(tileData, heightmap, y, x)) {
                        stairTopRight = this._scene.add.image(screenX + 24, screenY - (tileData * 32), 'stairs_top_right')
                        stairTopRight.setOrigin(0, 0)
                        stairTopRight.setInteractive({ pixelPerfect: true })
                    }

                    else if (this.isTopStair(tileData, heightmap[y], x)) {
                        stairTopLeft = this._scene.add.image(screenX, screenY - (tileData * 32), 'stairs_top_left')
                        stairTopLeft.setOrigin(0, 0)
                        stairTopLeft.setInteractive({ pixelPerfect: true })
                    }

                    else if (this.isBottomStair(tileData, heightmap[y],x )) {
                        stairLeft = this._scene.add.image(screenX - 1, screenY - (tileData * 32) - 7, 'stairs_left')
                        stairLeft.setOrigin(0, 0)
                        stairLeft.setInteractive({ pixelPerfect: true })
                    }

                    else if (this.isTopRightStair(tileData, heightmap, y, x)) {
                        stairBottomLeft = this._scene.add.image(screenX, screenY - (tileData * 32) - 15, 'stairs_bottom_left')
                        stairBottomLeft.setOrigin(0, 0)
                        stairBottomLeft.setInteractive({ pixelPerfect: true })
                    }

                    else if (this.isTopLeftStair(tileData, heightmap, y, x)) {
                        stairCenter = this._scene.add.image(screenX, screenY - (tileData * 32) - 7, 'stairs_center')
                        stairCenter.setOrigin(0, 0)
                        stairCenter.setInteractive({ pixelPerfect: true })
                    }

                    else if (this.isBottomLeftStair(tileData, heightmap, y, x)) {
                        stairBottomRight = this._scene.add.image(screenX, screenY - (tileData * 32) - 15, 'stairs_bottom_right')
                        stairBottomRight.setOrigin(0, 0)
                        stairBottomRight.setInteractive({ pixelPerfect: true })
                    }

                    else {
                        floorSprite = this._scene.add.image(screenX, screenY - (tileData * 32) + 32, 'tile')
                        floorSprite.setOrigin(0, 0)
                        floorSprite.setInteractive({ pixelPerfect: true })
                    }

                    if (x === door[0] && y === door[1]) {
                        // console.log(tileX, tileY)
                        let door = this._scene.add.image(screenX, screenY - 122, 'door')
                        door.setOrigin(0, 0)

                        let doorFloor = this._scene.add.image(screenX, screenY - 15, 'door_floor')
                        doorFloor.setOrigin(0, 0)

                        container.add(doorFloor)
                        container.add(door)

                    } else {
                        if (x < 1) {
                            let leftWallSprite = this._scene.add.image(screenX - 8, screenY - 122, 'wall_l')
                            leftWallSprite.setOrigin(0, 0)

                            container.add(leftWallSprite)
                        }

                        if (y < 1) {

                            let rightWallSprite = this._scene.add.image(screenX + 32, screenY - 122, 'wall_r')
                            rightWallSprite.setOrigin(0, 0)

                            container.add(rightWallSprite)
                        }
                    }

                    var floorSpriteHover: Phaser.GameObjects.Image

                    if (floorSprite !== undefined) {
                        floorSprite.on('pointerover', () => {
                            floorSpriteHover = this._scene.add.image(floorSprite.x, floorSprite.y - 3, 'tile_hover')
                            floorSpriteHover.setOrigin(0, 0)
                        })

                        // floorSprite.on('pointerdown', () => {
                        //     var cartTileCoords = this._scene.isometricToCartesian({ x: floorSprite.x, y: floorSprite.y, z: 0 })
                        //     var destination = this._scene.cartesianToCoords(cartTileCoords)

                        //     // this._scene.socket.emit('movePlayer', { x: destination.x, y: destination.y })
                        // })

                        floorSprite.on('pointerout', () => {
                            floorSpriteHover.destroy()
                        })

                        container.add(floorSprite)

                    }

                    if (stairRight !== undefined) {

                        stairRight.on('pointerover', () => {
                            floorSpriteHover = this._scene.add.image(stairRight.x, stairRight.y - 3 + 32, 'tile_hover')
                            floorSpriteHover.setOrigin(0, 0)
                        })

                        // stairRight.on('pointerdown', () => {
                        //     var cartTileCoords = this._scene.isometricToCartesian({ x: stairRight.x, y: stairRight.y, z: 0 })
                        //     var destination = this._scene.cartesianToCoords(cartTileCoords)

                        //     // this._scene.socket.emit('movePlayer', { x: destination.x, y: destination.y })
                        // })

                        stairRight.on('pointerout', () => {
                            floorSpriteHover.destroy()
                        })

                        container.add(stairRight)
                    }

                    if (stairTopRight !== undefined) {

                        stairTopRight.on('pointerover', () => {
                            floorSpriteHover = this._scene.add.image(stairTopRight.x, stairTopRight.y - 3 + 32, 'tile_hover')
                            floorSpriteHover.setOrigin(0, 0)
                        })

                        // stairRight.on('pointerdown', () => {
                        //     var cartTileCoords = this._scene.isometricToCartesian({ x: stairRight.x, y: stairRight.y, z: 0 })
                        //     var destination = this._scene.cartesianToCoords(cartTileCoords)

                        //     // this._scene.socket.emit('movePlayer', { x: destination.x, y: destination.y })
                        // })

                        stairTopRight.on('pointerout', () => {
                            floorSpriteHover.destroy()
                        })

                        container.add(stairTopRight)
                    }

                    if (stairTopLeft !== undefined) {
                        stairTopLeft.on('pointerover', () => {
                            floorSpriteHover = this._scene.add.image(stairTopLeft.x, stairTopLeft.y - 3, 'tile_hover')
                            floorSpriteHover.setOrigin(0, 0)
                        })

                        // stairRight.on('pointerdown', () => {
                        //     var cartTileCoords = this._scene.isometricToCartesian({ x: stairRight.x, y: stairRight.y, z: 0 })
                        //     var destination = this._scene.cartesianToCoords(cartTileCoords)

                        //     // this._scene.socket.emit('movePlayer', { x: destination.x, y: destination.y })
                        // })

                        stairTopLeft.on('pointerout', () => {
                            floorSpriteHover.destroy()
                        })

                        container.add(stairTopLeft)
                    }

                    if (stairLeft !== undefined) {
                        stairLeft.on('pointerover', () => {
                            floorSpriteHover = this._scene.add.image(stairLeft.x, stairLeft.y - 3 + 32, 'tile_hover')
                            floorSpriteHover.setOrigin(0, 0)
                        })

                        // stairRight.on('pointerdown', () => {
                        //     var cartTileCoords = this._scene.isometricToCartesian({ x: stairRight.x, y: stairRight.y, z: 0 })
                        //     var destination = this._scene.cartesianToCoords(cartTileCoords)

                        //     // this._scene.socket.emit('movePlayer', { x: destination.x, y: destination.y })
                        // })

                        stairLeft.on('pointerout', () => {
                            floorSpriteHover.destroy()
                        })

                        container.add(stairLeft)
                    }

                    if (stairBottomLeft !== undefined) {
                        stairBottomLeft.on('pointerover', () => {
                            floorSpriteHover = this._scene.add.image(stairBottomLeft.x, stairBottomLeft.y - 3 + 32, 'tile_hover')
                            floorSpriteHover.setOrigin(0, 0)
                        })

                        // stairRight.on('pointerdown', () => {
                        //     var cartTileCoords = this._scene.isometricToCartesian({ x: stairRight.x, y: stairRight.y, z: 0 })
                        //     var destination = this._scene.cartesianToCoords(cartTileCoords)

                        //     // this._scene.socket.emit('movePlayer', { x: destination.x, y: destination.y })
                        // })

                        stairBottomLeft.on('pointerout', () => {
                            floorSpriteHover.destroy()
                        })

                        container.add(stairBottomLeft)
                    }

                    if (stairCenter !== undefined) {
                        stairCenter.on('pointerover', () => {
                            floorSpriteHover = this._scene.add.image(stairCenter.x, stairCenter.y - 3 + 32, 'tile_hover')
                            floorSpriteHover.setOrigin(0, 0)
                        })

                        // stairRight.on('pointerdown', () => {
                        //     var cartTileCoords = this._scene.isometricToCartesian({ x: stairRight.x, y: stairRight.y, z: 0 })
                        //     var destination = this._scene.cartesianToCoords(cartTileCoords)

                        //     // this._scene.socket.emit('movePlayer', { x: destination.x, y: destination.y })
                        // })

                        stairCenter.on('pointerout', () => {
                            floorSpriteHover.destroy()
                        })

                        container.add(stairCenter)
                    }

                    if (stairBottomRight !== undefined) {
                        stairBottomRight.on('pointerover', () => {
                            floorSpriteHover = this._scene.add.image(stairBottomRight.x, stairBottomRight.y - 3 + 16, 'tile_hover')
                            floorSpriteHover.setOrigin(0, 0)
                        })

                        // stairRight.on('pointerdown', () => {
                        //     var cartTileCoords = this._scene.isometricToCartesian({ x: stairRight.x, y: stairRight.y, z: 0 })
                        //     var destination = this._scene.cartesianToCoords(cartTileCoords)

                        //     // this._scene.socket.emit('movePlayer', { x: destination.x, y: destination.y })
                        // })

                        stairBottomRight.on('pointerout', () => {
                            floorSpriteHover.destroy()
                        })

                        container.add(stairBottomRight)
                    }


                }
            }
        }

    }

    private isRightStair(currentTile: number, heightmap: number[][], currentTileRowNumber: number, currentTileIndex: number): boolean {
        var rightTile = this.getRightTile(heightmap, currentTileRowNumber, currentTileIndex)
        var deltaTile = rightTile - currentTile

        return deltaTile === 1
    }

    private getRightTile(heightmap: number[][], currentTileRowNumber: number, currentTileIndex: number): number {
        var rightTileRow = currentTileRowNumber - 1

        if (heightmap[rightTileRow] !== undefined) {
            return heightmap[rightTileRow][currentTileIndex]
        }
    }

    private isLeftStair(currentTile: number, heightmap: number[][], currentTileRowNumber: number, currentTileIndex: number): boolean {
        var leftTile = this.getLeftTile(heightmap, currentTileRowNumber, currentTileIndex)
        var deltaTile = leftTile - currentTile

        return deltaTile === 1
    }

    private getLeftTile(heightmap: number[][], currentTileRowNumber: number, currentTileIndex: number): number {
        var leftTileRow = currentTileRowNumber + 1

        if (heightmap[leftTileRow] !== undefined) {
            return heightmap[leftTileRow][currentTileIndex]
        }
    }

    private isTopStair(currentTile: number, currentTileRow: number[], currentTileIndex: number): boolean {
        var topTile = this.getTopTile(currentTileRow, currentTileIndex)
        var deltaTile = topTile - currentTile

        return deltaTile === 1
    }

    private getTopTile(currentTileRow: number[], currentTileIndex: number): number {
        if (currentTileRow !== undefined) {
            return currentTileRow[currentTileIndex + 1]
        }
    }

    private getBottomTile(currentTileRow: number[], currentTileIndex: number): number {
        if (currentTileRow !== undefined) {
            return currentTileRow[currentTileIndex - 1]
        }
    }

    private isBottomStair(currentTile: number, currentTileRow: number[], currentTileIndex: number): boolean {
        var bottomTile = this.getBottomTile(currentTileRow, currentTileIndex)
        var deltaTile = bottomTile - currentTile

        return deltaTile === 1
    }

    private getTopRightTile(heightmap: number[][], currentTileRowNumber: number, currentTileIndex: number): number {
        var topRow = currentTileRowNumber - 1

        if (heightmap[topRow] !== undefined) {
            return heightmap[topRow][currentTileIndex + 1]
        }
    }

    private isTopRightStair(currentTile: number, heightmap: number[][], currentTileRowNumber: number, currentTileIndex: number): boolean {
        var topRightTile = this.getTopRightTile(heightmap, currentTileRowNumber, currentTileIndex)
        var deltaTile = topRightTile - currentTile

        return deltaTile === 1
    }

    private getTopLeftTile(heightmap: number[][], currentTileRowNumber: number, currentTileIndex: number): number {
        var topRow = currentTileRowNumber - 1

        if (heightmap[topRow] !== undefined) {
            return heightmap[topRow][currentTileIndex - 1]
        }
    }

    private isTopLeftStair(currentTile: number, heightmap: number[][], currentTileRowNumber: number, currentTileIndex: number): boolean {
        var topLeftTile = this.getTopLeftTile(heightmap, currentTileRowNumber, currentTileIndex)
        var deltaTile = topLeftTile - currentTile

        return deltaTile === 1
    }

    private getBottomLeftTile(heightmap: number[][], currentTileRowNumber: number, currentTileIndex: number): number {
        var topRow = currentTileRowNumber + 1

        if (heightmap[topRow] !== undefined) {
            return heightmap[topRow][currentTileIndex - 1]
        }
    }

    private isBottomLeftStair(currentTile: number, heightmap: number[][], currentTileRowNumber: number, currentTileIndex: number): boolean {
        var bottomLeftTile = this.getBottomLeftTile(heightmap, currentTileRowNumber, currentTileIndex)
        var deltaTile = bottomLeftTile - currentTile

        return deltaTile === 1
    }

    private getScreenX(x: number, y: number): number {
        return x * RoomSprite.tileWidth - y * RoomSprite.tileWidth
    }

    private getScreenXWithZ(x: number, y: number, z: number): number {
        return this.getScreenX(x, y)
    }

    private getScreenY(x: number, y: number): number {
        return x * RoomSprite.tileHeight + y * RoomSprite.tileHeight
    }

    private getScreenYWithZ(x: number, y: number, z: number): number {
        return this.getScreenY(x, y) - z * RoomSprite.tileWidth
    }

    private getScreenZ(z: number): number {
        return z * RoomSprite.tileHeight
    }

    public addFurnitureSprite(furnitureSprite: FurnitureSprite, roomX: number, roomY: number, roomZ: number) {
        // Offset / Positioning of each Furniture (Container)
        furnitureSprite.x = this.getScreenX(roomX, roomY) + 32
        furnitureSprite.y = this.getScreenY(roomX, roomY) + 16

        furnitureSprite.y -= this.getScreenZ(roomZ)

        this.furnitureContainer.setDepth(roomX + roomY + roomZ /*3*/)
        this.furnitureContainer.add(furnitureSprite)

        this._scene.add.existing(this.furnitureContainer)
    }

    public start() {
        this.furnitureContainer.getAll().forEach((furnitureSprite) => {
            (furnitureSprite as FurnitureSprite).start()
        })
    }

    public stop() {
        this.furnitureContainer.getAll().forEach((furnitureSprite) => {
            (furnitureSprite as FurnitureSprite).stop()
        })
    }
}