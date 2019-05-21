import RoomSprite from '../sprite'
import RoomTileHover from './hover'

export default class RoomTile extends RoomSprite {

    constructor(scene, x, y, z, texture, depth) {

        super(scene, x, y, z, texture, depth)

        this.scene = scene
        this.x = x
        this.y = y
        this.z = z
        this.texture = texture
        this.depth = depth

        this.create()

    }

    create() {

        super.create()
        
        this.setInteractive({ pixelPerfect: true })

        this.on('pointerover', () => {
            this.addHover()
        })

        this.on('pointerout', () => {
            this.destroyHover()
        })

    }

    addHover() {
        this.hover = new RoomTileHover(this.scene, this.coordinates.x, this.coordinates.y, this.coordinates.z, `${this.texture.key}_hover`, this.depth + 1)
    }

    destroyHover() {

        if (this.hover !== undefined) {
            this.hover.destroy()
        }

    }
}