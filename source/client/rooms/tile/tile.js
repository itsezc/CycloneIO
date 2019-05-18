import RoomSprite from '../sprite'
import RoomTileHover from './hover'

export default class RoomTile extends RoomSprite {

    constructor(scene, x, y, z, texture, width, height) {

        super(scene, x, y, z, texture, width, height)

        this.create()

    }

    create() {

        this.scene.add.existing(this)

        		
		this.setTexture(this.texture.key)
	
        
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