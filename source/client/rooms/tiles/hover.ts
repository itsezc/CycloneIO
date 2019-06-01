import GameSprite from '../../games/sprite'

/**
 * RoomTileHover class
 * @extends GameSprite
 */
export default class RoomTileHover extends GameSprite {

    /**
     * Creates the hover tile
     */
    create(): void {

        super.create()
        this.setPosition(this.isometricCoords.x - 1, this.isometricCoords.y - 4)
    }
}