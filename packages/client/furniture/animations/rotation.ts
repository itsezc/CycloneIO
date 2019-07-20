import { AnimationFrame } from './animation-frames';

export default class RotationAnimation {
    private animationFrames: AnimationFrame[]

    private step: number
    public isRunning: boolean = false

    constructor(changeDirection: Function, private scope: any) {
        this.step = 0

        this.animationFrames = [
            {
                frameId: 1,
                nextPosition: { x: 0, y: 1 }
            },
            {
                frameId: 2,
                nextPosition: { x: 0, y: 1 }
            },
            {
                frameId: 3,
                nextPosition: { x: 0, y: 1 }
            },
            {
                frameId: 5,
                nextPosition: { x: 0, y: 0 },
                effect: changeDirection
            },
            {
                frameId: 7,
                nextPosition: { x: 0, y: -1 }
            },
            {
                frameId: 8,
                nextPosition: { x: 0, y: -1 }
            },
            {
                frameId: 9,
                nextPosition: { x: 0, y: -1 }
            },
        ]
    }

    public start() {
        this.isRunning = true
    }

    public tick() {
        if (!this.isRunning)
            return

        this.step++

        const lastAnimationFrame = this.animationFrames[this.animationFrames.length - 1]

        // console.log('Last Animation', lastAnimationFrame)

        if (this.step > lastAnimationFrame.frameId) {
            this.stop()

            return
        }

        const currentAnimationFrame = this.animationFrames.find(f => f.frameId === this.step)

        // console.log('Current Animation', currentAnimationFrame)

        if (currentAnimationFrame != null) {
            if (currentAnimationFrame.effect) {
                currentAnimationFrame.effect.call(this.scope)
            }
        }
    }

    public stop() {
        this.step = 0

        this.isRunning = false
    }

    public getNextPosition() {
        const animationFrames = this.animationFrames.filter(f => f.frameId <= this.step)

        const currentAnimatonFrame = { x: 0, y: 0 }

        animationFrames.forEach((frame) => {
            currentAnimatonFrame.x -= frame.nextPosition.x
            currentAnimatonFrame.y -= frame.nextPosition.y
        })

        return currentAnimatonFrame != null ? currentAnimatonFrame : null
    }
}