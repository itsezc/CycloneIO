import Furniture from './furniture'
import Room from '../rooms/room'

export default class FurnitureSprite extends Phaser.GameObjects.Container {
    public scene: Room
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

    public constructor(scene: Room, furniture: Furniture) {
        super(scene)

        this.scene = scene
        this.furniture = furniture
        this.playing = false

        this.frameCount = 0
        this.totalTimeRunning = 0

        this.animation = null
        this.color = null

        this.setDirection(this.furniture.getDirections()[0])
        //console.log(this.furniture.data);
	}

    public start()
    {
        if (!this.playing)
        {
            this.playing = true
            // Delta time = Velocity of X < -- > 
            this.timer = this.scene.time.addEvent({ 
                delay: 0,
                callback: this.update,
                callbackScope: this,
                loop: true,
            })

            // this.timer.args = [this.delta]

            // console.log(this.timer.args)
           
            // this.timer = this.clock.addEvent({
            //     delay: 0,
            //     callback: this.update,
            //     callbackScope: this,
            //     loop: true
            // }) 

            // this.timer = this.clock.delayedCall(0, this.update, [], this)

            //console.log(this.timer)

            // setTimeout(() => {
            //     console.log('timeout', this.timer.elapsed)
            // }, 1000)
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

			//console.log('Animating with ', animation)
            // Lava Lamp (1 as Animation) -> if (null != 1) -> animation = 1 
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
        }        
    }

    private getDepthIndex(sprite: any) {
        const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

        const frameName = sprite.frame.name
        const fragments = frameName.split('_')

        const layer = fragments[fragments.length - 3]
        
        return (ALPHABET.indexOf(layer.toLowerCase())) + sprite.z;          
    }

    private isCorrectSizeLayer(sprite: any) {
        const frameName = sprite.frame.name
        const fragments = frameName.split('_')

        const size = parseInt(fragments[fragments.length - 4])

        return size === FurnitureSprite.DEFAULT_SIZE
    }

    public updateFurnitureView()
    {
        this.removeAll()

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
        }).filter((layer: any) => {
            return this.isCorrectSizeLayer(layer)
        })

        this.add(orderedLayers)
    }

    private setEventsFor(sprite: Phaser.GameObjects.Sprite) {
        sprite.on('rotate', (s: Phaser.GameObjects.Sprite) => {
            this.direction = this.furniture.getNewDirectionFor(s, this.direction)
        })
    }

    public destroy()
    {
        this.stop()

        super.destroy()
    }
}