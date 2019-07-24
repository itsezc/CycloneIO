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
            // console.log(heightmap[y])
            // console.log('next row ', heightmap[y - 1])

            for (let x = 0;x < heightmap[y].length;x++) {
                const tileData = heightmap[y][x]

                let screenX = this.getScreenX(x, y)
                let screenY = this.getScreenY(x, y)

                if (tileData !== -1) {

                    //console.log(this.getRightTile(heightmap, y, x))
                    //console.log(this.isRightStair(tileData, heightmap, y, x))

                    let floorSprite: Phaser.GameObjects.Image
                    let stair: Phaser.GameObjects.Image

                    if (this.isRightStair(tileData, heightmap, y, x)) {
                        stair = this._scene.add.image(screenX, screenY - (tileData * 32) - 32, 'stairs_right')
                        stair.setOrigin(0, 0)
                        stair.setInteractive({ pixelPerfect: true })
                    }

                    // if (this.isLeftStair(tileData, heightmap, y, x)) {
                    //     stair = this._scene.add.image(screenX, screenY - (tileData * 32) - 32, 'stairs_left')
                    //     stair.setOrigin(0, 0)
                    //     stair.setInteractive({ pixelPerfect: true })
                    // }

                    else {
                        floorSprite = this._scene.add.image(screenX, screenY - (tileData * 32), 'tile')
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

                    if (floorSprite) {
                        floorSprite.on('pointerover', () => {
                            floorSpriteHover = this._scene.add.image(floorSprite.x, floorSprite.y - 3, 'tile_hover')
                            floorSpriteHover.setOrigin(0, 0)
                        })

                        floorSprite.on('pointerdown', () => {
                            var cartTileCoords = this._scene.isometricToCartesian({ x: floorSprite.x, y: floorSprite.y, z: 0 })
                            var destination = this._scene.cartesianToCoords(cartTileCoords)

                            // this._scene.socket.emit('movePlayer', { x: destination.x, y: destination.y })
                        })

                        floorSprite.on('pointerout', () => {
                            floorSpriteHover.destroy()
                        })

                        container.add(floorSprite)

                    }

                    if (stair) {

                        stair.on('pointerover', () => {
                            floorSpriteHover = this._scene.add.image(stair.x, stair.y - 3 + 32, 'tile_hover')
                            floorSpriteHover.setOrigin(0, 0)
                        })

                        stair.on('pointerdown', () => {
                            var cartTileCoords = this._scene.isometricToCartesian({ x: stair.x, y: stair.y, z: 0 })
                            var destination = this._scene.cartesianToCoords(cartTileCoords)

                            // this._scene.socket.emit('movePlayer', { x: destination.x, y: destination.y })
                        })

                        stair.on('pointerout', () => {
                            floorSpriteHover.destroy()
                        })

                        container.add(stair)
                    }


                }
            }
        }

    }

    private isRightStair(currentTile: number, heightmap: number[][], currentTileRow: number, currentTileIndex: number): boolean {
        var rightTile = this.getRightTile(heightmap, currentTileRow, currentTileIndex)
        var deltaTile = rightTile - currentTile

        return deltaTile === 1
    }

    private getRightTile(heightmap: number[][], currentTileRow: number, currentTileIndex: number): number {
        var rightTileRow = currentTileRow - 1

        if (rightTileRow !== -1) {
            return heightmap[rightTileRow][currentTileIndex]
        }
    }

    // private isLeftStair(currentTile: number, heightmap: number[][], currentTileRow: number, currentTileIndex: number): boolean {
    //     var leftTile = this.getLeftTile(heightmap, currentTileRow, currentTileIndex)
    //     var deltaTile = leftTile - currentTile

    //     return deltaTile === 1
    // }

    // private getLeftTile(heightmap: number[][], currentTileRow: number, currentTileIndex: number): number {
    //     var leftTileRow = currentTileRow + 1

    //     if (leftTileRow !== -1) {
    //         return heightmap[leftTileRow][currentTileIndex]
    //     }
    // }

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