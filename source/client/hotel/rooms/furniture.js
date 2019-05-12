export default class RoomFurniture extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, z, texture, depth) {

        super(scene, x, y - z)

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

        this.setTexture(this.texture)

        this.scene.add.existing(this)

        this.scene.anims.create({
            key: this.texture.key,
            frames: this.scene.anims.generateFrameNumbers(this.texture.key, { start: 1, end: this.texture.frameTotal }),
            frameRate: 13,
            repeat: -1,
            yoyo: true
        })

        this.setOrigin(0.5, 0.88)
        this.setDepth(2)
        this.setInteractive({ pixelPerfect: true })

        this.scene.onDoubleClick(this, () => {
            this.animate()
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
}