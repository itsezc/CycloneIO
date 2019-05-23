export default class RoomTileHover extends Phaser.GameObjects.Image {

    constructor(scene, x, y) {
        
        super(scene, x, y)

        this.scene = scene
        this.x = x
        this.y = y

        this.create()

    }

    create() {

        this.setTexture('tile_hover')

        this.scene.add.existing(this)



        this.setOrigin(0.5, 0.6)

        this.setDepth(2)

    }
}