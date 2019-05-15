export default class RoomTileHover extends Phaser.GameObjects.Image {

    constructor(scene, x, y, z, depth) {
        
        super(scene, x, y - z)

        this.scene = scene
        this.x = x
        this.y = y
        this.z = z
        this.depth = depth

        this.create()

    }

    create() {

        this.setTexture('tile_hover')

        this.scene.add.existing(this)

        this.setOrigin(0.5, 0.6)

        this.setDepth(this.depth)

    }
}