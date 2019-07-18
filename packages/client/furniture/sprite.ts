import Furniture from './furniture'
import Room from '../rooms/room'
import RotationAnimation from './animations/rotation';

import FurnitureData from '../furniture/data'

export default class FurnitureSprite extends Phaser.GameObjects.Container {
    
    public _scene: Room
    private static FPS = 24
    private static FPS_TIME_MS = 60 / FurnitureSprite.FPS
    private static DEFAULT_SIZE = 64

    private furniture: Furniture
    private playing: boolean

    private frameCount: number
    private totalTimeRunning: number

    private timer!: Phaser.Time.TimerEvent
    private animation!: number
    private direction!: number
    private color!: number

    private lastClick: number = 0
    private doubleClick: boolean = false

    private animationRotation: RotationAnimation

    public constructor(scene: Room, furniture: Furniture) {
        super(scene)

        this._scene = scene
        this.furniture = furniture
        this.playing = false

        this.frameCount = 0
        this.totalTimeRunning = 0

        this.animation = null
        this.color = null

        this.setDirection(this.furniture.getDirections()[0])

        this.animationRotation = new RotationAnimation(this.rotateFurniture, this)
	}

    public start()
    {
        if (!this.playing)
        {
            this.playing = true
            this.timer = this._scene.time.addEvent({ 
                delay: 0,
                callback: this.update,
                callbackScope: this,
                loop: true,
            })
        }
    }

    public stop()
    {
        if (this.playing)
        {
            this.playing = false

            this.timer.remove()
        }

    }

    public animateAndStart(animation: number)
    {
        if (this.furniture.hasAnimation(animation)
            || animation == null)
        {

			// console.log('Animating with ', animation)
            if (this.animation != animation)
            {
                this.animation = animation

                this.updateFurnitureView()
            }

            this.start()
        }
    }

    public animateAndStop(animation: number)
    {
		console.log('Current animation set to ', animation)
        if (this.furniture.hasAnimation(animation)
            || animation == null)
        {
            this.stop()

            if (this.animation != animation)
            {
                this.animation = animation

                this.updateFurnitureView()
            }
        }
    }

    public setAnimation(animation: number)
    {
        if (this.furniture.hasAnimation(animation)) 
        {
            this.animation = animation
        }
    }

    public setDirection(direction: number)
    {
        if (this.furniture.hasDirection(direction))
        {
            this.direction = direction
        }
    }

	public getDirection() 
	{
		return this.direction
	}

    public setColor(color: number)
    {
        if (this.furniture.hasColor(color)
            || this.color == null) 
        {
            this.color = color
        }
    }

    public update()
    {
        this.totalTimeRunning += 1

        let frameCount = Math.round(this.totalTimeRunning / FurnitureSprite.FPS_TIME_MS)

        if (this.frameCount != frameCount)
        {
            this.frameCount = frameCount
            this.updateFurnitureView()

            this.animationRotation.tick()
        }
    }

    private getDepthIndex(sprite: any) {
        const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

        const frameName = sprite.frame.name
        const fragments = frameName.split('_')

        const layer = fragments[fragments.length - 3]
        
        return (ALPHABET.indexOf(layer.toLowerCase())) + sprite.z;          
    }

    private isCorrectSizeSprite(sprite: any) {
        const frameName = sprite.frame.name
        const fragments = frameName.split('_')

        const size = parseInt(fragments[fragments.length - 4])

        return size === FurnitureSprite.DEFAULT_SIZE
    }

    public updateFurnitureView()
    {
        this.removeAll(true)
        //this.removeInteractive()

        const layers = []

        for (let layerId = 0; layerId < this.furniture.getLayerCount(); layerId++)
        {

            let frameIndex = this.furniture.getFrameFrom(this.animation, layerId, this.frameCount)
            let layerSprite = this.furniture.getSpriteFrom(FurnitureSprite.DEFAULT_SIZE, false, this.direction, layerId, frameIndex)


            if (layerSprite != null)
            {
                this.setEventsFor(layerSprite)

                this.furniture.updateSpriteFrom(layerSprite, layerId)
                this.furniture.updateSpriteFromDirection(layerSprite, this.direction, layerId)

                if (this.animationRotation.isRunning) {
                    this.updateSpriteByRotationAnimation(layerSprite)
                }

                //this.setInteractions()

                if (this.furniture.hasColorForLayer(this.color, layerId))
                {
                    let color = this.furniture.getColorFrom(this.color, layerId)

                    layerSprite.tint = color
                }

                layerSprite.depth = this.getDepthIndex(layerSprite)
                
                layers.push(layerSprite)
            }
        }

        // Shadow
        const shadowLayer = this.furniture.getSpriteFrom(FurnitureSprite.DEFAULT_SIZE, true, this.direction)

        if(shadowLayer != null) {
            layers.push(shadowLayer)
        }
        
        // Depth sorting for sprites inside the furniture
        const orderedLayers = layers.sort((a: any,  b: any) => {
            return (a.depth > b.depth ? 1 : -1)
        }).filter((sprite: Phaser.GameObjects.Sprite) => {
            return this.isCorrectSizeSprite(sprite)
        })

        const clickableLayers = orderedLayers.filter((sprite: any) => {
            return sprite.isClickable
        })

        this.add(orderedLayers)
        //this.setInteractive()
    }

    private animateRotation() {
        console.log('Rotating')
        this.animationRotation.start()
    }

    private getFirstSprite() {
        return this.getAll().find((gameObject) => gameObject instanceof Phaser.GameObjects.Sprite) as Phaser.GameObjects.Sprite
    }

    private rotateFurniture() {
        const firstSprite = this.getFirstSprite()

        if(firstSprite != null) {
            this.direction = this.furniture.getNewDirectionFor(firstSprite, this.direction)
        }
    }

    private updateSpriteByRotationAnimation(sprite: Phaser.GameObjects.Sprite) {
        const nextPosition = this.animationRotation.getNextPosition()

        if (nextPosition != null) {
            sprite.x += nextPosition.x
            sprite.y += nextPosition.y
        }
    }

    private canBeRotated(sprite: Phaser.GameObjects.Sprite) {
        return this.direction !== this.furniture.getNewDirectionFor(sprite, this.direction)
    }

    private setEventsFor(sprite: Phaser.GameObjects.Sprite) {
        sprite.on('rotate', (instance: Phaser.GameObjects.Sprite) => {
            if(this.canBeRotated(instance) && !this.animationRotation.isRunning) {
                this.animateRotation()
            }
        })

        sprite.on('click', (instance: Phaser.GameObjects.Sprite) => {
            if (this.frameCount - this.lastClick <= 45 && this.lastClick !== 0) {
                if(!this.doubleClick) {
                    this.doubleClick = true
                } else {
                    this.animation = this.furniture.getNewAnimationFor(instance, this.animation)
                    this.doubleClick = false
                }

                this.lastClick = 0
            } else {
                this.doubleClick = false
            }

            this.lastClick = this.frameCount
        })
    }

    public destroy()
    {
        this.stop()

        super.destroy()
    }
}