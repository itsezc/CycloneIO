import RoomSprite from './sprite'
import RoomTileHover from './hoverTile'

export default class RoomTile extends RoomSprite {

    constructor(scene, x, y, z, width, height, texture) {

        super(scene, x, y, z, width, height, texture)

        this.create()

    }

    create() {

        this.setDepth(1)
        
        this.setInteractive({ pixelPerfect: true })

        // this.on('pointerover', () => {
        //     this.hover = new RoomTileHover(this.scene, this.x, this.y, this.z)
        // })

        // this.on('pointerout', () => {
        //     this.hover.destroy()
        // })

    }
}