import Room from '../rooms/room'
import { GameObjects } from 'phaser'
const { Container, Sprite } = GameObjects

export default abstract class RoomItem 
{

	private nextState: number
	private frame: number
	private frameCounter: number
	private sprites: Phaser.GameObjects.Sprite[]
	private selectableSprites: Phaser.GameObjects.Sprite[]
	private containers: Phaser.GameObjects.Container[]
	private selectableContainers: Phaser.GameObjects.Container[]
	private baseItem: BaseItem | null
	private loaded: boolean
	private color: number
	
	constructor(
		private readonly id: number,
		private readonly x: number,
		private readonly y: number,
		private readonly z: number,
		private readonly rotation: number,
		private readonly state: number,
		private readonly baseId: number,
		private readonly room: Room,
		private readonly placeholderSprite: Phaser.GameObjects.Sprite
	) {
		this.nextState = -1
		this.baseItem = null
		this.frame = 0
		this.frameCounter = 0
		this.loaded = false
		this.color = Math.floor(Math.random() * (16777215 - 1)) + 1

		const placeHolderContainer = new Container(this.room)
		placeHolderContainer.depth = this.calculateZIndex(0, 0)

		const placeHolderSelectableContainer = new Container(this.room)
		placeHolderSelectableContainer.depth = placeHolderContainer.depth

		const placeHolderSelectableSprite = new Sprite()

		this.sprites = [placeHolderSprite]
		this.containers = [placeHolderContainer]
		this.containers[0].add(placeholderSprite)

		this.selectableSprites = [placeHolderSelectableSprite]
		this.selectableContainers = [placeHolderSelectableContainer]
		this.selectableContainers[0].add(placeHolderSelectableSprite)
	}

	abstract calculateZIndex(zIndex: number, layerIndex: number): number
}