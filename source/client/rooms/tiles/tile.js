// @flow

import Phaser, { Textures } from 'phaser'

const { Texture } = Textures

import RoomSprite from '../sprite'
import Room from '../room'

import RoomTileHover from './hover'

/**
 * RoomTile class
 * @extends {RoomSprite}
 */
export default class RoomTile extends RoomSprite {

    scene: Room
    x: number
    y: number
    z: number
    texture: Texture
    depth: number
    
    /**
     * @param {Room} scene - The room scene
     * @param {number} x - The x position of the tile
	 * @param {number} y - The y position of the tile
     * @param {number} z - The z position of the tile
     * @param {string} texture - The tile texture
     * @param {number} depth - The tile depth
     */
    constructor(scene: Room, x: number, y: number, z: number, texture: Texture, depth: number) {

        super(scene, x, y, z, texture, depth)

        this.scene = scene
        this.x = x
        this.y = y
        this.z = z
        this.texture = texture
        this.depth = depth

        this.create()
    }

    /**
     * Creates the tile
     */
    create(): void {

        super.create()
        
        this.setPosition(this.isometric.x, this.isometric.y)
        this.setInteractive({ pixelPerfect: true })

        this.on('pointerover', () => {
            this.addHover()
        })

        this.on('pointerout', () => {
            this.destroyHover()
        })
    }

    /**
     * Adds hover tile
     */
    addHover(): void {
        this.hover = new RoomTileHover(this.scene, this.coordinates.x, this.coordinates.y, this.coordinates.z, `${this.texture.key}_hover`, this.depth + 1)
    }

    /**
     * Destroys hover tile
     */
    destroyHover(): void {

        if (this.hover !== undefined) {
            this.hover.destroy()
        }
    }
}