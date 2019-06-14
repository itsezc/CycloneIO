import Furniture from './furniture'
import Room from '../rooms/room';

export default class FurnitureSprite extends Phaser.GameObjects.Container
{
    public readonly scene: Room
    private static FPS = 24
    private static FPS_TIME_MS = 60 / FurnitureSprite.FPS
    private static DEFAULT_SIZE = 64

    private furniture: Furniture
    private playing: boolean

    private frameCount: number
    private totalTimeRunning: number

    private direction!: number
    private animation!: number
    private color!: number
    private timer!: Phaser.Types.Time.TimerEventConfig

    public constructor(scene: Room, furniture: Furniture)
    {
        super(scene)

        this.scene = scene

        this.furniture = furniture
        this.playing = false

        this.frameCount = 0
        this.totalTimeRunning = 0

        this.setDirection(this.furniture.getDirections()[0])
    }

    public start()
    {
        if (!this.playing)
        {
            this.playing = true

            //PIXI.ticker.shared.add(this.update, this)
            this.timer = this.scene.time.addEvent({
                delay: 0,
                callback: this.update,
                callbackScope: this,
                loop: true
            })
        }
    }

    public stop()
    {
        if (this.playing)
        {
            this.playing = false;

            //this.timer.remove()
        }
    }

    public animateAndStart(animation: number)
    {
        if (this.furniture.hasAnimation(animation)
            || animation == null)
        {

            if (this.animation != animation)
            {
                this.animation = animation;

                this.updateFurnitureView()
            }

            this.start()
        }
    }

    public animateAndStop(animation: number)
    {
        if (this.furniture.hasAnimation(animation)
            || animation == null)
        {
            this.stop();

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

    public setColor(color: number)
    {
        if (this.furniture.hasColor(color)
            || this.color == null) 
        {
            this.color = color
        }
    }

    public update(deltaTime: number)
    {
        this.totalTimeRunning += deltaTime
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

        for (let layerId = 0;layerId < this.furniture.getLayerCount();layerId++)
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

        this.getAll().sort((a: any, b: any) =>
        {
            return a.z - b.z
        })
    }

    public destroy()
    {
        this.stop()

        super.destroy()
    }
}