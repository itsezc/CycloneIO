import GameSprite from '../../games/sprite'
import RoomTileHover from './hover'
import Room from '../room'

import { RoomModelDepth } from '../../../common/enums/rooms/models/depth'

/**
 * RoomTile class
 * @extends {RoomSprite}
 */
export default class RoomTile extends Phaser.GameObjects.Graphics {
    
    static readonly width: number = 32
    static readonly height: number = 32

    private topSurfacePoints!: number[]
    private hover!: RoomTileHover
    
    public constructor(scene: Room)
    {
        super(scene)
        this.scene = scene

        this.create()
    }
    /**
     * Creates the tile
     */
    private create(): void 
    {
        this.scene.add.existing(this)

        this.topSurfacePoints = [
            0, 0,
            32, 64,
            64, 64,
            -32, 64
        ]

        this.fillPoints(this.topSurfacePoints)
        this.strokePoints(this.topSurfacePoints, true)
        
/*         this.setPosition(this.isometricCoords.x, this.isometricCoords.y)
        this.setInteractive({ pixelPerfect: true })

        this.on('pointerover', () => {
            this.addHover()
        })

        this.on('pointerout', () => {
            this.destroyHover()
        }) */

    }

    /**
     * Adds a hover tile
     */
    public addHover(): void {
/*         this.hover = new RoomTileHover(this.scene, this.coordinates, RoomModelDepth.TILE_HOVER, this.texture.key.concat('_hover'))
        this.hover.create() */
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