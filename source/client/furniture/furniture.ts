
//import type { FurnitureType } from '../../common/enums/furniture/type'
<<<<<<< HEAD
import FurnitureData from './data'
=======
>>>>>>> 4ad1d2e437cd3d331ffdf96ba761ad5f4744eaff
import Room from '../rooms/room'
//import { FurnitureType } from '../../common/enums/furniture/type'
export interface IData {
	type: string
	name: string
	visualizationType: string;
	logicType: string
	spritesheet: string
	dimensions: IDimension
	directions: number[]
	assets: { [key: string] : IAsset }
	visualization: IVisualization
}

export interface IDimension {
	x: number
	y: number
	z: number
}

export interface IAsset {
	source?: string
	x: number
	y: number
	flipH?: boolean
}

export interface IVisualization {
	layerCount: number
	angle: number
	layers?: { [key: string] : ILayer }
	colors?: { [key: string] : IColor }
	directions?: { [key: string] : IDirections }
	animations?: { [key: string] : IAnimation }
}

export interface ILayer {
	x?: number
	y?: number
	z?: number
	alpha?: number
	ink?: string
	ignoreMouse?: boolean
}

export interface IColor {
	layers: { [key: string] : IColorLayer }
}

export interface IColorLayer {
	color: number
}

export interface IDirections {
	layers: { [key: string] : ILayer }
}

export interface IAnimation {
	layers: { [key: string] : IAnimationLayer }
}

export interface IAnimationLayer {
	loopCount?: number
	frameRepeat?: number
	frames: number[]
}

export default class Furniture
{

<<<<<<< HEAD
	private readonly scene: Room
	private data: FurnitureData.IData
=======
	private data: IData
	public scene: Room
>>>>>>> 4ad1d2e437cd3d331ffdf96ba761ad5f4744eaff

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
	// constructor(id: number, spriteName: string, name: string, description: string, type: FurnitureType, width: number, length: number, height: number, canStand: boolean, canStack: boolean, canWalk: boolean, canSit: boolean) {
	// 	this.id = id
	// 	this.spriteName = spriteName
	// 	this.name = name
	// 	this.description = description
	// 	this.type = type
	// 	this.width = width
	// 	this.length = length
	// 	this.height = height
	// 	this.canStand = canStand
	// 	this.canStack = canStack
	// 	this.canWalk = canWalk
	// 	this.canSit = canSit
	// }

	constructor(scene: Room, data: IData)
	{
		this.scene = scene
		this.data = data
	}

	// User goes into the room -> RoomID -> DB / Server -> Client Furniture[] -> forEach Furniture => Furni (where Furniture class is initiated) -> Item (getFurniture(basedOnId))
	// public static load(id?: number): Furniture {
	// 	return new Furniture(0, "throne", "name", "desc", FurnitureType.FLOOR, 0, 0, 0, false, true, false, false)
	// }

    public getLayerCount(): number {
        return this.data.visualization.layerCount;
    }

    public getAngle(): number {
        return this.data.visualization.angle;
    }

    public getDirections(): number[] {
        return this.data.directions.map((direction) => direction / 90 * 2);
        // move map to actuall json data (ffconverter)
    }

    public hasDirection(direction: number): boolean {
        direction = direction / 2 * 90;
        // move above values (see map) to actuall json data (ffconverter)

        return this.data.directions.indexOf(direction) >= 0;
    }

	public hasAnimations(): boolean {
        return this.data.visualization.animations != null;
    }

	public hasAnimation(animation: number): boolean
	{
		if(this.data !== undefined)
		{
			return this.hasAnimations()
            	&& this.data.visualization.animations[animation] != null
		}
    }

	public hasAnimationForLayer(animation: number, layer: number): boolean
	{
		if(this.data !== undefined) {
			return this.hasAnimation(animation)
            	&& this.data.visualization.animations[animation].layers[layer] != null
		}

        return false
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
            if (animationLayer.frames.length < 1) {
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
		return String.fromCharCode(layer + 97)
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

	// PIXI.Sprite
	// Phaser.GameObjects.
	public getSpriteFrom(size: number | string, layer: number, direction?: number, frame?: number): any
	{
		let assetName = this.assetNameFrom(size, layer, direction, frame)

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
				// create image and then the texture name -> create sprite -> name_sourcename.png
				let layerSprite = new Phaser.GameObjects.Sprite(this.scene, -asset.x, -asset.y, this.data.name + "_" + sourceName + ".png")

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
	private doUpdateSprite(sprite: Phaser.GameObjects.Sprite, layer: FurnitureData.ILayer)
	{
		if (layer.alpha)
		{
			sprite.alpha = layer.alpha / 255
		}

		if (layer.ink && Phaser.BlendModes[layer.ink])
		{
			sprite.blendMode = Phaser.BlendModes[layer.ink]
		}

		if (layer.x)
		{
			sprite.x += layer.x
		}

		if (layer.y)
		{
			sprite.y += layer.y
		}

		if (layer.z)
		{
			sprite.z = layer.z
		}

		if (layer.ignoreMouse)
		{
			sprite.setInteractive()

			//sprite.interactive = !layer.ignoreMouse
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

}

