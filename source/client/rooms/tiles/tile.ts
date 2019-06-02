import GameSprite from '../../games/sprite'
import RoomTileHover from './hover'

import { RoomModelDepth } from '../../../common/enums/rooms/models/depth'

/**
 * RoomTile class
 * @extends {RoomSprite}
 */
export default class RoomTile extends GameSprite {
    
    static readonly width: number = 32
    static readonly height: number = 32

    private hover!: RoomTileHover

    /**
     * Creates the tile
     */
    public create(): void {

        super.create()
        
        this.setPosition(this.isometricCoords.x, this.isometricCoords.y)
        this.setInteractive({ pixelPerfect: true })

        this.on('pointerover', () => {
            this.addHover()
        })

        this.on('pointerout', () => {
            this.destroyHover()
        })

    }

    /**
     * Adds a hover tile
     */
    public addHover(): void {
        this.hover = new RoomTileHover(this.scene, this.coordinates, RoomModelDepth.TILE_HOVER, this.texture.key.concat('_hover'))
        this.hover.create()
    }

    /**
     * Destroys the hover tile
     */
    public destroyHover(): void {
        if (this.hover !== undefined) {
            this.hover.destroy()
        }
    }
}