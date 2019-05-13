import RoomTileHover from './hoverTile'

export default class RoomTile extends Phaser.GameObjects.Image {

    constructor(scene, x, y, z, texture, depth) {

        super(scene, x, y - z)

        this.scene = scene
        this.x = x
        this.y = y
        this.z = z
        this.texture = texture
        this.depth = depth  

        this.create()

    }

    create() {

        this.setTexture(this.texture)

        this.scene.add.existing(this)
        
        this.setInteractive({ pixelPerfect: true })

        this.on('pointerover', () => {
            this.hover = new RoomTileHover(this.scene, this.x, this.y, this.z, 'tile_hover', this.depth + 1)
        })

        this.on('pointerout', () => {
            this.hover.destroy()
        })

    }
}