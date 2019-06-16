import * as Furniture from '../furniture/'
import Room from './room'
import FurnitureSprite from '../furniture/sprite'
import { GameObject } from '../games/object';

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

                let floorSprite = this.scene.physics.add.image(screenX, screenY, 'tile');
                floorSprite.setOrigin(0)
                floorSprite.setInteractive({ pixelPerfect: true })

                var floorSpriteHover: Phaser.GameObjects.Image

                floorSprite.on('pointerover', () =>
                {
                    floorSpriteHover = this.scene.add.image(floorSprite.x, floorSprite.y - 3, 'tile_hover')
                    floorSpriteHover.setOrigin(0, 0)
                })

                floorSprite.on('pointerdown', () => {
                    this.scene.physics.moveTo(floorSprite, floorSprite.x, floorSprite.y - 84, 200)
                    floorSprite.setDepth(4)
/* 
                    var collider = this.scene.physics.add.overlap(this.scene.avatar, floorSprite, (avatarOnBlock: any) => {
                        avatarOnBlock.body.stop()
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