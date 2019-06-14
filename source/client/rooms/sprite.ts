import * as Furniture from '../furniture/'
import Room from './room'
import FurnitureSprite from '../furniture/sprite';

export default class RoomSprite extends Phaser.GameObjects.Container {

	public furnitureContainer: Phaser.GameObjects.Container

	public readonly scene: Room

    private static realTileWidth = 64
    private static realTileHeight = 32
    private static tileWidth = RoomSprite.realTileWidth / 2
    private static tileHeight = RoomSprite.realTileHeight / 2

	constructor(scene: Room)
	{
		super(scene)

		this.scene = scene
		this.furnitureContainer = new Phaser.GameObjects.Container(scene)
	}

	private getScreenX(x: number, y: number): number
	{
        return x * RoomSprite.tileWidth - y * RoomSprite.tileWidth
    }

    private getScreenXWithZ(x: number, y: number, z: number): number
	{
        return this.getScreenX(x, y)
    }

    private getScreenY(x: number, y: number): number {
        return x * RoomSprite.tileHeight + y * RoomSprite.tileHeight
    }

    private getScreenYWithZ(x: number, y: number, z: number): number
	{
        return this.getScreenY(x, y) - z * RoomSprite.tileWidth;
    }

    public addFurnitureSprite(furnitureSprite: Furniture.FurnitureSprite, roomX: number, roomY: number)
	{
        furnitureSprite.x = this.getScreenX(roomX, roomY) + 32
        furnitureSprite.y = this.getScreenY(roomX, roomY) + 16

        this.furnitureContainer.add(furnitureSprite)
    }

    public start()
	{

		this.furnitureContainer.getAll().forEach((furnitureSprite) => {
			(furnitureSprite as FurnitureSprite).start()
		})
        // this.furnitureContainer.children.forEach((furnitureSprite) => {
        //     (furnitureSprite as Furniture.FurnitureSprite).start()
        // })
    }

    public stop()
	{
        this.furnitureContainer.getAll().forEach((furnitureSprite) => {
            (furnitureSprite as FurnitureSprite).stop()
        })
    }
}