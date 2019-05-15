import RoomTileHover from './hoverTile'

export default class RoomTile extends Phaser.GameObjects.Image {

    constructor(scene, x, y,/*  z, */) {

        super(scene, x, y)

        this.scene = scene
        this.x = x
        this.y = y
        //this.z = z

        this.create()

    }

    create() {

        this.setTexture('tile')

        this.scene.add.existing(this)

        this.setDepth(1)
        
        this.setInteractive({ pixelPerfect: true })

        this.on('pointerover', () => {
            this.hover = new RoomTileHover(this.scene, this.x, this.y, this.z, this.depth + 1)
        })

        this.on('pointerout', () => {
            this.hover.destroy()
        })

    }

    get cartesian() {
        return new Phaser.Geom.Point((this.y * 2 + this.x) / 2, (this.y * 2 - this.x) / 2)
    }

    get coordinates() {
        return new Phaser.Geom.Point(Math.floor(this.cartesian.x / this.height), Math.floor(this.cartesian.y / this.height))
    }
}