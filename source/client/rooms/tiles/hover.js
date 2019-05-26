import RoomSprite from '../sprite'

import Room from '../room'

/**
 * RoomTileHover class
 * @extends RoomSprite
 */
export default class RoomTileHover extends RoomSprite {

    /**
     * @param {Room} scene
     * @param {number} x - The x position of the hover tile
	 * @param {number} y - The y position of the hover tile
     * @param {number} z - The z position of the hover tile
     * @param {string} texture - The hover tile texture
     * @param {number} depth - The hover tile depth
     */
    constructor(scene: Room, x: number, y: number, z: number, texture: string, depth: number) {

        super(scene, x, y, z, texture, depth)
        this.create()
    }

    /**
     * Creates the hover tile
     */
    create(): void {

        super.create()
        this.setPosition(this.x - 1, this.y - 4)
    }
}