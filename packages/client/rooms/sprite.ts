import * as Furniture from '../furniture/'
import Room from './room'
import FurnitureSprite from '../furniture/sprite'
import { GameObject } from '../games/object';

import Pathfinder, { DiagonalMovement } from 'pathfinding'
import { thisExpression } from 'babel-types';

export default class RoomSprite extends Phaser.GameObjects.Container
{

    private heightmap: string[]

    public roomContainer: Phaser.GameObjects.Container
    public furnitureContainer: Phaser.GameObjects.Container

    public _scene: Room

    private static realTileWidth = 64
    private static realTileHeight = 32
    private static tileWidth = RoomSprite.realTileWidth / 2
    private static tileHeight = RoomSprite.realTileHeight / 2

    constructor(
        scene: Room, 
        heightmap: string[],
        private readonly door: [number, number]
    )
    {
        super(scene)

        this.heightmap = heightmap;

        this._scene = scene

        this.roomContainer = new Phaser.GameObjects.Container(scene)
        this.furnitureContainer = new Phaser.GameObjects.Container(scene)

        this.add(this.roomContainer)
        this.add(this.furnitureContainer)

        this.initializeRoomHeightmap(this.roomContainer, this.door, this.heightmap)
    }

    private initializeRoomHeightmap(container: Phaser.GameObjects.Container, door: [number, number], heightmap: string[])
    {
        let floorMaxY = heightmap.length;
        let floorMaxX = heightmap[0].length;

        let tileModules = floorMaxX;

        let floorIndex = 0;
        do
        {
            let tileX = Math.floor(floorIndex % tileModules)
            let tileY = Math.floor(floorIndex / tileModules)

            let tileData = heightmap[tileY].charAt(tileX)

            let screenX = this.getScreenX(tileX, tileY)
            let screenY = this.getScreenY(tileX, tileY)

            if (tileData != 'x')
            {
                
                if (tileX === door[0] && tileY === door[1]) {
                    // console.log(tileX, tileY)
                    let door = this._scene.add.image(screenX, screenY - 122, 'door')
                    door.setOrigin(0, 0)

                    let doorFloor = this._scene.add.image(screenX, screenY - 15, 'door_floor')
                    doorFloor.setOrigin(0, 0)

                    container.add(doorFloor)
                    container.add(door)
                    
                } else {
                    if (tileX < 1)
                    {
                        let leftWallSprite = this._scene.add.image(screenX - 8, screenY - 122, 'wall_l')
                        leftWallSprite.setOrigin(0, 0)
    
                        container.add(leftWallSprite)
                    }

                    if (tileY < 1)
                    {
                   
                        let rightWallSprite = this._scene.add.image(screenX + 32, screenY - 122, 'wall_r')
                        rightWallSprite.setOrigin(0, 0)

                        container.add(rightWallSprite)
                    }
                }

                
                let floorSprite = this._scene.add.image(screenX, screenY, 'tile');
                floorSprite.setOrigin(0, 0)
                floorSprite.setInteractive({ pixelPerfect: true })

                var floorSpriteHover: Phaser.GameObjects.Image

                floorSprite.on('pointerover', () =>
                {
                    floorSpriteHover = this._scene.add.image(floorSprite.x, floorSprite.y - 3, 'tile_hover')
                    floorSpriteHover.setOrigin(0, 0)
                })

                floorSprite.on('pointerdown', () =>
                {
                    var cartTileCoords = this._scene.isometricToCartesian({ x: floorSprite.x, y: floorSprite.y, z: 0 })
                    var destination = this._scene.cartesianToCoords(cartTileCoords)

                    this._scene.socket.emit('movePlayer', { x: destination.x, y: destination.y })
                })

                floorSprite.on('pointerout', () =>
                {
                    floorSpriteHover.destroy()
                })

                container.add(floorSprite)
            }
        }
        while (++floorIndex < floorMaxX * floorMaxY);
    }


    private getScreenX(x: number, y: number): number
    {
        return x * RoomSprite.tileWidth - y * RoomSprite.tileWidth
    }

    private getScreenXWithZ(x: number, y: number, z: number): number
    {
        return this.getScreenX(x, y)
    }

    private getScreenY(x: number, y: number): number
    {
        return x * RoomSprite.tileHeight + y * RoomSprite.tileHeight
    }

    private getScreenYWithZ(x: number, y: number, z: number): number
    {
        return this.getScreenY(x, y) - z * RoomSprite.tileWidth
    }

    private getScreenZ(z: number): number {
        return z * RoomSprite.tileHeight
    }

    public addFurnitureSprite(furnitureSprite: FurnitureSprite, roomX: number, roomY: number, roomZ: number)
    {
        // Offset / Positioning of each Furniture (Container)
        furnitureSprite.x = this.getScreenX(roomX, roomY) + 32
        furnitureSprite.y = this.getScreenY(roomX, roomY) + 16

        furnitureSprite.y -= this.getScreenZ(roomZ)

        this.furnitureContainer.setDepth(3)
        this.furnitureContainer.add(furnitureSprite)

        this._scene.add.existing(this.furnitureContainer)
    }

    public start()
    {
        this.furnitureContainer.getAll().forEach((furnitureSprite) =>
        {
            (furnitureSprite as FurnitureSprite).start()
        })
    }

    public stop()
    {
        this.furnitureContainer.getAll().forEach((furnitureSprite) =>
        {
            (furnitureSprite as FurnitureSprite).stop()
        })
    }
}