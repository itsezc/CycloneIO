// @flow

import Phaser, { Textures } from 'phaser'

const { Texture } = Textures

import RoomSprite from '../../games/sprite'
import Room from '../room'

import type { Vector } from '../../../common/types/vector'

import RoomTileHover from './hover'

/**
 * RoomTile class
 * @extends {RoomSprite}
 */
export default class RoomTile extends RoomSprite {

    scene: Room
    coordinates: Vector
    texture: Texture
    depth: number
    
    /**
     * @param {Room} scene - The room scene
     * @param {number} coordinates - The coordinates of the tile
     * @param {string} texture - The tile texture
     * @param {number} depth - The tile depth
     */
    constructor(scene: Room, coordinates: Vector, texture: Texture, depth: number) {

        super(scene, coordinates, texture, depth)

        this.scene = scene
        this.coordinates = coordinates
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
     * Adds a hover tile
     */
    addHover(): void {
        this.hover = new RoomTileHover(this.scene, this.coordinates.x, this.coordinates.y, this.coordinates.z, `${this.texture.key}_hover`, this.depth + 1)
    }

    /**
     * Destroys the hover tile
     */
    destroyHover(): void {

        if (this.hover !== undefined) {
            this.hover.destroy()
        }
    }
}