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

    public updateFurnitureView()
    {
        this.removeAll()

        for (let layerId = 0; layerId < this.furniture.getLayerCount(); layerId++)
        {
            let frameIndex = this.furniture.getFrameFrom(this.animation, layerId, this.frameCount)
            let layerSprite = this.furniture.getSpriteFrom(FurnitureSprite.DEFAULT_SIZE, layerId, this.direction, frameIndex)

            if (layerSprite != null)
            {
                this.furniture.updateSpriteFrom(layerSprite, layerId)
                this.furniture.updateSpriteFromDirection(layerSprite, this.direction, layerId)

                if (this.furniture.hasColorForLayer(this.color, layerId))
                {
                    let color = this.furniture.getColorFrom(this.color, layerId)

                    layerSprite.tint = color
                }
                
                this.add(layerSprite)
            }
        }
        
        // Depth sorting for sprites inside the furniture
        this.getAll().sort((a: any,  b: any) => {
            return a.z - b.z
        })
    }

    public destroy()
    {
        this.stop()

        super.destroy()
    }
}