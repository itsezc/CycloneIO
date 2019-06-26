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

    public scene: Room

    private static realTileWidth = 64
    private static realTileHeight = 32
    private static tileWidth = RoomSprite.realTileWidth / 2
    private static tileHeight = RoomSprite.realTileHeight / 2

    constructor(scene: Room, heightmap: string[])
    {
        super(scene)

        this.heightmap = heightmap;

        this.scene = scene

        this.roomContainer = new Phaser.GameObjects.Container(scene)
        this.furnitureContainer = new Phaser.GameObjects.Container(scene)

        this.add(this.roomContainer)
        this.add(this.furnitureContainer)

        this.initializeRoomHeightmap(this.roomContainer, this.heightmap)
    }

    private initializeRoomHeightmap(container: Phaser.GameObjects.Container, heightmap: string[])
    {
        let floorMaxY = heightmap.length;
        let floorMaxX = heightmap[0].length;

        let tileModules = floorMaxX;

        let floorIndex = 0;
        do
        {
            let tileX = Math.floor(floorIndex % tileModules);
            let tileY = Math.floor(floorIndex / tileModules);

            let tileData = heightmap[tileY].charAt(tileX);

            let screenX = this.getScreenX(tileX, tileY);
            let screenY = this.getScreenY(tileX, tileY);

            if (tileData != "x")
            {
                if (tileX < 1)
                {
                    let leftWallSprite = this.scene.add.image(screenX - 8, screenY - 122, 'wall_l')
                    leftWallSprite.setOrigin(0, 0)

                    container.add(leftWallSprite);
                }

                if (tileY < 1)
                {
                    let rightWallSprite = this.scene.add.image(screenX + 32, screenY - 122, 'wall_r')
                    rightWallSprite.setOrigin(0, 0)

                    container.add(rightWallSprite);
                }

                let floorSprite = this.scene.add.image(screenX, screenY, 'tile');
                floorSprite.setOrigin(0)
                floorSprite.setInteractive({ pixelPerfect: true })

                var floorSpriteHover: Phaser.GameObjects.Image

                floorSprite.on('pointerover', () =>
                {
                    floorSpriteHover = this.scene.add.image(floorSprite.x, floorSprite.y - 3, 'tile_hover')
                    floorSpriteHover.setOrigin(0, 0)
                })


                var timeline: Phaser.Tweens.Timeline


                floorSprite.on('pointerdown', () =>
                {
                    var cartTileCoords = this.scene.isometricToCartesian({ x: floorSprite.x, y: floorSprite.y, z: 0 })
                    var destination = this.scene.cartesianToCoords(cartTileCoords)

                    this.scene.socket.emit('movePlayer', { x: destination.x, y: destination.y })
                    // if (!this.scene.avatarIsMoving)
                    // {
                    //     var grid = new Pathfinder.Grid(this.scene.map);
                    //     //this.scene.avatarIsWalking = true

                    //     /* this.scene.physics.moveTo(floorSprite, floorSprite.x, floorSprite.y - 84, 200)
                                            
                    //     this.scene.time.addEvent({
                    //         delay: 4000,
                    //         callback: () => {
                    //         floorSprite.destroy()
                    //         }
                    //     }) */

                    //     var tweens = []

                    //     var cartTileCoords = this.scene.isometricToCartesian({ x: floorSprite.x, y: floorSprite.y, z: 0 })
                    //     var tileCoords = this.scene.cartesianToCoords(cartTileCoords)

                    //     var cartAvatarCoords = this.scene.isometricToCartesian({
                    //         x: Math.floor(this.scene.avatar.x),
                    //         y: Math.floor(this.scene.avatar.y + 84),
                    //         z: 0
                    //     })
                    //     var avatarCoords = this.scene.cartesianToCoords(cartAvatarCoords)

                    //     console.log({
                    //         x: this.scene.avatar.x,
                    //         y: this.scene.avatar.y + 84
                    //     })
                    //     console.log({ avatarCoords: avatarCoords, tileCoords: tileCoords })

                    //     // every tween update direction and path

                    //     var path = this.scene.finder.findPath(Math.sign(avatarCoords.x) === -1 ? avatarCoords.x + 1 : avatarCoords.x,
                    //         Math.sign(avatarCoords.y) === -1 ? avatarCoords.y + 1 : avatarCoords.y,
                    //         tileCoords.x, tileCoords.y, grid)

                    //     console.log(path)

                    //     for (var i = 1;i < path.length;i++)
                    //     {
                    //         var nextTileX = path[i][0]
                    //         var nextTileY = path[i][1]

                    //         var nextTile = { x: nextTileX, y: nextTileY }

                    //         var tileX = this.getScreenX(nextTile.x, nextTile.y)
                    //         var tileY = this.getScreenY(nextTile.x, nextTile.y)

                    //         var deltaCoords = { x: avatarCoords.x - nextTile.x, y: avatarCoords.y - nextTile.y }

                    //         if (deltaCoords.x === 0 && deltaCoords.y > 0)
                    //         {
                    //             this.scene.avatarRotation = 0
                    //             this.scene.avatar.play('wlk_0')
                    //         }

                    //         if (deltaCoords.x === 0 && deltaCoords.y < 0)
                    //         {
                    //             this.scene.avatarRotation = 4
                    //             this.scene.avatar.play('wlk_4')
                    //         }

                    //         if (deltaCoords.x > 0 && deltaCoords.y === 0)
                    //         {
                    //             this.scene.avatarRotation = 6
                    //             this.scene.avatar.play('wlk_6')
                    //         }

                    //         if (deltaCoords.x < 0 && deltaCoords.y === 0)
                    //         {
                    //             this.scene.avatarRotation = 2

                    //             this.scene.avatar.play('wlk_2')
                    //         }

                    //         if (deltaCoords.x > 0 && deltaCoords.y < 0)
                    //         {
                    //             this.scene.avatarRotation = 5
                    //             this.scene.avatar.play('wlk_5')
                    //         }

                    //         if (deltaCoords.x < 0 && deltaCoords.y > 0)
                    //         {
                    //             this.scene.avatarRotation = 1
                    //             this.scene.avatar.play('wlk_1')
                    //         }

                    //         if (deltaCoords.x < 0 && deltaCoords.y < 0)
                    //         {
                    //             this.scene.avatarRotation = 3
                    //             this.scene.avatar.play('wlk_3')
                    //         }

                    //         if (deltaCoords.x > 0 && deltaCoords.y > 0)
                    //         {
                    //             this.scene.avatarRotation = 7
                    //             this.scene.avatar.play('wlk_7')
                    //         }

                    //         this.scene.physics.moveTo(this.scene.avatar, tileX, tileY - 84, 70)

                    //         this.scene.avatarIsMoving = true

                    //         this.scene.time.addEvent(
                    //             {
                    //                 delay: 500,
                    //                 callback: () => {
                    //                     this.scene.avatarIsMoving = false
                    //                 }
                    //             }
                    //         )

                    //         this.scene.tileDestination = { x: tileX, y: tileY - 84 }
                    //     }

                    //     /* tweens.push({
                    //         targets: this.scene.avatar,
                    //         x: tileX,
                    //         y: tileY - 84,
                    //         duration: 500,
                    //         ease: 'Linear'
                    //     }) */
                    // }

                    /* timeline = this.scene.tweens.timeline({
                        tweens: tweens,
                        onComplete: () =>
                        {
                            
                        }
                    }) */
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

    public addFurnitureSprite(furnitureSprite: FurnitureSprite, roomX: number, roomY: number)
    {
        // Offset / Positioning of each Furniture (Container)
        furnitureSprite.x = this.getScreenX(roomX, roomY) + 32
        furnitureSprite.y = this.getScreenY(roomX, roomY) + 16

        this.furnitureContainer.setDepth(3)
        this.furnitureContainer.add(furnitureSprite)

        this.scene.add.existing(this.furnitureContainer)
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