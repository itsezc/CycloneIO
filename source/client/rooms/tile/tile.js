import RoomSprite from '../sprite'
import RoomTileHover from './hover'

export default class RoomTile extends RoomSprite {

    constructor(scene, x, y, z, texture, width, height, depth) {

        super(scene, x, y, z, texture, width, height, depth)

        this.scene = scene
        this.x = x
        this.y = y
        this.z = z
        this.texture = texture
        this.width = width
        this.height = height
        this.depth = depth

        this.create()

    }

    create() {

        super.create()
        
        this.setInteractive({ pixelPerfect: true })

        this.on('pointerover', () => {

            this.hover = new RoomTileHover(this.scene, this.isometricToCoords(this.coordinates).x, this.isometricToCoords(this.coordinates).y, this.z, `${this.texture.key}_hover`, this.width, this.height, this.depth + 1)
            // console.log(this.hover)
        })

        this.on('pointerout', () => {
            this.hover.destroy()
        })

    }
}