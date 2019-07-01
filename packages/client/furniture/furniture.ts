
//import type { FurnitureType } from '../../common/enums/furniture/type'
import Room from '../rooms/room'
//import { FurnitureType } from '../../common/enums/furniture/type'
export interface IData
{
	type: string
	name: string
	visualizationType: string;
	logicType: string;
	spritesheet: string
	dimensions: IDimension
	directions: number[]
	assets: { [key: string]: IAsset }
	visualization: IVisualization
}

export interface IDimension
{
	x: number
	y: number
	z: number
}

export interface IAsset
{
	name?: string
	source?: string
	x: number
	y: number
	flipH?: boolean
}

export interface IVisualization
{
	layerCount: number
	angle: number
	layers?: { [key: string]: ILayer }
	colors?: { [key: string]: IColor }
	directions?: { [key: string]: IDirections }
	animations?: { [key: string]: IAnimation }
}

export interface ILayer
{
	x: number
	y: number
	z: number
	alpha?: number
	ink?: any
	ignoreMouse?: boolean
}

export interface IColor
{
	layers: { [key: string]: IColorLayer }
}

export interface IColorLayer
{
	color: number
}

export interface IDirections
{
	layers: { [key: string]: ILayer }
}

export interface IAnimation
{
	layers: { [key: string]: IAnimationLayer }
}

export interface IAnimationLayer
{
	loopCount?: number
	frameRepeat?: number
	frames: number[]
}

export default class Furniture
{
	private data: IData
	public scene: Room
	
	public animation!: number
	public direction!: number

	// private id: number // (Furniture Number)
	// private spriteName: string
	// private name: string
	// private description: string
	// private type: FurnitureType
	// private width: number
	// private length: number
	// private height: number
	// private canStand: boolean
	// private canStack: boolean
	// private canWalk: boolean
	// private canSit: boolean

	/**
	 * @param {number} id - The furniture ID
	 * @param {string} spriteName - The furniture file name
	 * @param {string} name - The furniture name
	 * @param {string} description - The furniture description
	 * @param {FurnitureType} type - The furniture type
	 * @param {number} width - The furniture width
	 * @param {number} length - The furniture length
	 * @param {number} height - The furniture height
	 * @param {boolean} canStack - Sets whether the furniture can be stackable or not
	 * @param {boolean} canWalk - Sets whether the furniture can be walkable or not
	 * @param {boolean} canSit - Sets whether an entity can sit on the furniture or not
	 */

	constructor(scene: Room, data: IData)
	{
		this.scene = scene
		this.data = data
	}

	// User goes into the room -> RoomID -> DB / Server -> Client Furniture[] -> forEach Furniture => Furni (where Furniture class is initiated) -> Item (getFurniture(basedOnId))
	// public static load(id?: number): Furniture {
	// 	return new Furniture(0, "throne", "name", "desc", FurnitureType.FLOOR, 0, 0, 0, false, true, false, false)
	// }

	public getLayerCount(): number
	{
		return this.data.visualization.layerCount
	}

	public getAngle(): number 
	{
		return this.data.visualization.angle
	}

	public getDirections(): number[]
	{
		return this.data.directions.map((direction) => direction / 90 * 2);
		// move map to actuall json data (ffconverter)
	}

	public hasDirection(direction: number): boolean
	{
		direction = direction / 2 * 90;
		// move above values (see map) to actuall json data (ffconverter)

		return this.data.directions.indexOf(direction) >= 0;
	}

	public hasAnimations(): boolean
	{
		return this.data.visualization.animations != null
	}

	public hasAnimation(animation: number): boolean
	{
		return this.hasAnimations()
            && this.data.visualization.animations[animation] != null
	}

	public hasAnimationForLayer(animation: number, layer: number): boolean
	{
		return this.hasAnimation(animation)
            && this.data.visualization.animations[animation].layers[layer] != null
	}

	public getAnimations(): string[]
	{
		return Object.keys(this.data.visualization.animations);
	}

	public getFrameFrom(animation: number, layer: number, frameCount: number): number
	{
		if (this.hasAnimationForLayer(animation, layer))
		{

			let animationLayer = this.data.visualization.animations[animation].layers[layer]
			
			if (animationLayer.frames.length < 1)
			{
				return 0
			}

			let frameRepeat = animationLayer.frameRepeat || 1

			let frameIndex = Math.floor((frameCount % (animationLayer.frames.length * frameRepeat)) / frameRepeat)

			return animationLayer.frames[frameIndex]
		}

		return 0
	}

	public hasColors(): boolean
	{
		return this.data.visualization.colors != undefined
	}

	public hasColor(color: number): boolean
	{
		return this.hasColors()
			&& this.data.visualization.colors[color] != undefined
	}

	public hasColorForLayer(color: number, layer: number): boolean
	{
		return this.hasColor(color)
			&& this.data.visualization.colors[color].layers[layer] != null;
	}

	public getColorFrom(color: number, layer: number): number
	{
		if (this.hasColorForLayer(color, layer))
		{
			return this.data.visualization.colors[color].layers[layer].color
		}

		return 0xFFFFFF
	}

	public getColors(): string[]
	{
		return Object.keys(this.data.visualization.colors)
	}

	private layerFromNumber(layer: number): string
	{
		return layer === -1 ? 'sd' : String.fromCharCode(layer + 97)
	}

	private assetNameFrom(size: number | string, layer: number, direction?: number, frame?: number): string
	{
		let layerChar = this.layerFromNumber(layer)
		let assetName = this.data.name + "_" + size + "_" + layerChar
		if (direction != undefined && frame != undefined)
		{
			assetName += "_" + direction + "_" + frame
		}

		return assetName;
	}

	private hasAsset(assetName: string)
	{
		return this.data.assets[assetName] != null
	}

	private frameExists(frameName: string) {
		const frames = Object.keys(this.scene.textures.get(this.data.name).frames)

		return frames.find(f => f === frameName) != null
	}

	public getSpriteFrom(size: number | string, shadow: boolean, direction?: number, layer?: number, frame?: number): any
	{
		let assetName = shadow ? this.assetNameFrom(size, -1, direction, 0) : this.assetNameFrom(size, layer, direction, frame)

		if (this.hasAsset(assetName))
		{
			let asset = this.data.assets[assetName]
			let sourceName = assetName
			if (asset.source != null)
			{
				sourceName = asset.source
			}

			try
			{
				// Offset / Positioning for each Layer
				//	console.log(sourceName)
				const frameName = this.data.name + '_' + sourceName + '.png'

				if (!this.frameExists(frameName)) {
					return undefined
				}

				let layerSprite = new Phaser.GameObjects.Sprite(this.scene, -asset.x, -asset.y, this.data.name, frameName)
				layerSprite.setOrigin(0, 0)

				;(layerSprite as any).isClickable = true

				this.setInteractionsFor(layerSprite)

				if (layerSprite.frame.name !== frameName) {
					return undefined
				}


				//console.log(this.data.name + '_' + sourceName + '.png', frame)

				if (shadow) {
					layerSprite.alpha = 0.1
				}
				
				if (asset.flipH)
				{
					layerSprite.scaleX = -1
					layerSprite.x *= -1
				}

				return layerSprite
			}
			catch (e)
			{
				return undefined
			}
		}

		return undefined
	}

	public hasLayers(): boolean
	{
		return this.data.visualization.layers != null;
	}

	public hasLayer(layer: number): boolean
	{
		return this.hasLayers()
			&& this.data.visualization.layers[layer] != null;
	}

	public hasVisualDirections(): boolean
	{
		return this.data.visualization.directions != null;
	}

	public hasVisualDirection(direction: number): boolean
	{
		return this.hasVisualDirections()
			&& this.data.visualization.directions[direction] != null;
	}

	public hasVisualDirectionLayer(direction: number, layer: number): boolean
	{
		return this.hasVisualDirection(direction)
			&& this.data.visualization.directions[direction].layers[layer] != null;
	}

	private doUpdateSprite(sprite: any, layer: ILayer)
	{
		sprite.alpha = layer.alpha ? layer.alpha / 255 : 1

		if (layer.ink)
		{
			// 28 is our custom blendMode
			sprite.blendMode = layer.ink === 'ADD' ? 28 : Phaser.BlendModes[layer.ink]
		}

		sprite.x += layer.x ? layer.x : 0

		sprite.y += layer.y ? layer.y : 0

		sprite.z += layer.z ? layer.z : 0

		if (layer.ignoreMouse) {
			sprite.isClickable = false
		}
	}

	public updateSpriteFrom(sprite: Phaser.GameObjects.Sprite, layer: number)
	{
		if (this.hasLayer(layer))
		{
			this.doUpdateSprite(sprite, this.data.visualization.layers[layer])
		}
	}

	public updateSpriteFromDirection(sprite: Phaser.GameObjects.Sprite, direction: number, layer: number)
	{
		if (this.hasVisualDirectionLayer(direction, layer))
		{
			this.doUpdateSprite(sprite, this.data.visualization.directions[direction].layers[layer])
		}
	}

	private setInteractionsFor(sprite: Phaser.GameObjects.Sprite) {
		sprite.setInteractive()

		sprite.input.cursor = 'pointer'

		sprite.on('pointerdown', (e: Phaser.Input.Pointer) => {
			if (e.event.shiftKey) {
				sprite.emit('rotate', sprite)
			} else {
				sprite.emit('click', sprite)
			}
		}, this)
	}
	
    public getNewDirectionFor(sprite: Phaser.GameObjects.Sprite, direction: number): number {
		let newDirection = direction + 2

		if (this.data.directions.find(d => d === newDirection / 2 * 90) == null) {
			newDirection = 0
		}
		
		return newDirection
	}
	
	public getNewAnimationFor(sprite: Phaser.GameObjects.Sprite, animation: number): number {
		let newAnimation = ++animation

		if (!this.hasAnimation(newAnimation)) {
			newAnimation = -1
		}
		
		return newAnimation
    }
}

