import RoomSprite from './sprite'

export default class RoomFurniture extends RoomSprite {

    constructor(scene, x, y, z, texture) {

        super(scene, x, y, z, texture, 3)

        this.scene = scene
        this.x = x
        this.y = y
        this.z = z
        this.texture = texture

        this.preload()

    }

    preload() {
        this.scene.load.setPath(`web-build/furniture/${this.texture}/`)
        this.scene.load.atlas(this.texture, `${this.texture}.png`, `${this.texture}.json`)
        this.scene.load.start()

        this.scene.load.once('complete', () => {
            this.create()
        })
    }

    create() { 

        super.create()

        this.scene.anims.create({
            key: this.texture.key,
            frames: this.scene.anims.generateFrameNumbers(this.texture.key, { start: 1, end: this.texture.frameTotal }),
            frameRate: 13,
            repeat: -1,
            yoyo: true
        })

        //this.alpha = 0.5

        this.setPosition(this.x, this.y - this.height / 2.8)
        this.setInteractive({ pixelPerfect: true })

        this.scene.onDoubleClick(this, () => {
            this.animate()
        })

        this.on('pointerover', () => {
            this.rotate()
        })

    }

    animate() {

        if (!this.anims.isPlaying) {
            this.anims.play(this.texture.key) 
        }

        else {
            this.anims.remove(this.texture.key)
            this.setFrame(0)
        }

    }

    rotate() {
        // this.scene.tweens.add({
        //     targets: this,
        //     y: -6,
        //     duration: 100,
        //     yoyo: true,
        // })

        this.flipX = !this.flipX
    }
}