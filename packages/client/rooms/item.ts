import Room from './room'
import { ItemType, Direction } from '../furniture/data'

export interface ContainerGroup {
	containers: Phaser.GameObjects.Container[],
	selectableContainers: Phaser.GameObjects.Container[]
}

export const FPS: number = 24

export default abstract class RoomItem {

	nextState: number
	
	sprites: Phaser.GameObjects.Sprite[]
	selectableSprites: Phaser.GameObjects.Sprite[]

	containers: Phaser.GameObjects.Container[]
	selectableContainers: Phaser.GameObjects.Container[]

	loaded: boolean

	color: number

	frame: number
	frameCounter: number
	
	baseItem: any

	drawAsIcon: boolean


	constructor(
		public id: number,
		public x: number, 
		public y: number,
		public z: number,
		public state: number,
		public rotation: Direction,
		public base: number, 
		public room: Room,
		public placeHolderSprite: Phaser.GameObjects.Sprite
	) {
		this.nextState = -1

		this.baseItem = null

		this.frame = 0
		this.frameCounter = 0

		this.loaded = false
		this.drawAsIcon = false

		this.color = Math.floor(Math.random() * (16777215 - 1)) + 1

		const placeHolderContainer = new Phaser.GameObjects.Container(this.room)
		placeHolderContainer.setDepth(this.calculateZIndex(0, 0))

		const placeHolderSelectableContainer = new Phaser.GameObjects.Container(this.room)
		placeHolderSelectableContainer.setDepth(placeHolderContainer.z)

		const placeHolderSelectableSprite = new Phaser.GameObjects.Sprite(this.room, this.x, this.y, 'placholder_furniture')

		this.sprites = [placeHolderSprite]
		this.containers = [placeHolderContainer]
		this.containers[0].add(placeHolderSprite)

		this.selectableSprites = [placeHolderSelectableSprite]
		this.selectableContainers = [placeHolderSelectableContainer]
		this.selectableContainers[0].add(placeHolderSelectableSprite)

		this.updateSpritePosition()
	}

	tick(delta: number) {
		this.frameCounter += delta
		if (this.frameCounter >= 80) {
			this.nextPrivateFrame()
			this.frameCounter = 0 
		}
	}

	setState(state: number) 
	{
		this.state = state
		this.nextState = -1
		this.frame = 0
		this.updateTextures()
	}

	updateState(state: number) 
	{
		if(this.baseItem !== null &&
			this.baseItem.furniBase.states[state] !== null) 
			{
				const { transition } = this.baseItem.furniBase.states[state]

				if (transition !== null)
				{

					this.state = transition
					this.frame = 0
					this.nextState = 0
				
				} else {	

					this.setState(state)

				}
			} 
	}

	nextPrivateFrame()
	{
		this.frame++

		if(this.nextState !== null &&
			this.baseItem !== null)
			{
				if(this.frame >= this.baseItem.furniBase.states[this.state].count)
				{
					this.setState(this.nextState)
				}
			}
	}

	setAdditionalSprites()
	{
		if (this.baseItem !== null) 
		{
			const layerCount = this.baseItem.furniBase.offset.visualization[this.baseItem.furniBase.size].layerCount + 1

			for(let i = 1; i < parseInt(layerCount); i++)
			{
				const Sprite = new Phaser.GameObjects.Sprite(this.room, this.x, this.y, '')
				Sprite.visible = false

				const SelectableSprite = new Phaser.GameObjects.Sprite(this.room, this.x, this.y, '')
				Sprite.visible = false

				const Container = new Phaser.GameObjects.Container(this.room)
				Container.add(Sprite)

				const SelectableContainer = new Phaser.GameObjects.Container(this.room)
				SelectableContainer.add(Sprite)

				this.sprites.push(Sprite)
				this.containers.push(Container)
				this.selectableSprites.push(SelectableSprite)
				this.selectableContainers.push(SelectableContainer)
			}
			
			this.updateTextures()
		}
	}

	updateTextures()
	{
		if(this.baseItem !== null)
		{
			let State: number = 0
			let Frame: number = 0
			let Layer: number = 0

			if (this.drawAsIcon) {
				const Sprite = this.sprites[Layer]
				const Container = this.containers[Layer]

				Sprite.texture = this.baseItem.iconTexture
				Sprite.x = -(this.baseItem.iconTexture.width / 2)
				Sprite.y = -(this.baseItem.iconTexture.height / 2)
				Sprite.scaleX = 1
				Sprite.alpha = 1
				Sprite.tint =  0xFFFFFF

				Container.z = this.calculateZIndex(0, Layer)
				Layer++
			
			} else {

				if (this.baseItem.furniBase.states[this.state] !== null)
				{
					State = this.state 
					Frame = this.frame % this.baseItem.furniBase.states[this.state].count
				}
				 
				for (let layer of this.baseItem.furniBase.getLayers(this.rotation, State, Frame))
				{
					const Texture = this.baseItem.getTexture(layer.ResourceName)
					const selectableTexture = this.baseItem.getSolidTexture(layer.ResourceName)

					if (Texture !== null)
					{

						const Sprite = this.sprites[Layer]
						const selectableSprite = this.selectableSprites[Layer]
						const zIndex = layer.z || 0

						Sprite.texture = Texture
						Sprite.visible = true

						if (selectableTexture !== null &&
							!layer.ignoreMouse) 
							{
								selectableSprite.texture = selectableTexture
								selectableSprite.visible = true
							}

						Sprite.x = -layer.asset.x
						Sprite.y = -layer.asset.y

						selectableSprite.x = -layer.asset.x
						selectableSprite.y = -layer.asset.y

						if (layer.asset.isFlipped) 
						{
							Sprite.x = layer.asset.x
							Sprite.scaleX = -1
						
							selectableSprite.x = layer.asset.x
							selectableSprite.scaleX = -1
						} else {

							Sprite.scaleX = 1
							selectableSprite.scaleX = 1
												
						}

						if (layer.ink !== null 
							&& layer.ink === 'ADD')
							{
								Sprite.setBlendMode(Phaser.BlendModes.ADD)
							} else {
								Sprite.setBlendMode(Phaser.BlendModes.NORMAL)
							}

						if (layer.alpha !== null)
						{
						
							Sprite.setAlpha(layer.alpha / 255)
						
						} else {
						
							Sprite.setAlpha(1)
						
						}

						if (layer.color !== null) 
						{

							Sprite.tint = layer.color

						} else {

							Sprite.tint = 0xFFFFFF

						}

						selectableSprite.tint =	this.color

						this.containers[layer].z = this.calculateZIndex(zIndex, layer)
						this.selectableContainers[layer].z = this.containers[layer].z
						layer++
					}
				}
			}	


			for (let i = Layer; i < this.sprites.length; i++)
			{
				this.sprites[i].visible = false
				this.selectableSprites[i].visible = false
			}
		}
	}


	// loadBase(): Promise<ContainerGroup>
	// {
	// 	return 
	// }


	startMovement() {
		for (let container in this.containers) {
			if (this.containers.hasOwnProperty(container))
			{
				container.setAlpha(0.7)
			}			
		}
	}

	stopMovement() {
		for (let container in this.containers) {
			if (this.containers.hasOwnProperty(container)) 
			{
				container.setAlpha(1)
			}
		}
	}

	abstract calculateZIndex(z: number, layer: number): number

	abstract updateSpritePosition(): void

	abstract updatePosition(x: number, y: number, z: number, rotation: Direction, drawAsIcon: boolean): void

	abstract getItemType(): ItemType
}