// @flow

import Phaser, { Textures } from 'phaser'

const { Texture } = Textures

import GameSprite from '../../games/sprite'

import Room from '../room'

import type { Vector } from '../../../common/types/rooms/vector'

import RoomTileHover from './hover'

import RoomModelDepth from '../../../common/enums/rooms/models/depth'

/**
 * RoomTile class
 * @extends {RoomSprite}
 */
export default class RoomTile extends GameSprite {

    scene: Room
    coordinates: Vector
    texture: Texture
    
    /**
     * @param {Room} scene - The room scene
     * @param {Vector} coordinates - The coordinates of the tile
     * @param {Texture} texture - The tile texture
     */
    constructor(scene: Room, coordinates: Vector, texture: Texture) {

        super(scene, coordinates, texture, RoomModelDepth.TILE)

        this.scene = scene
        this.coordinates = coordinates
        this.texture = texture

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

        console.log(this.depth)

    }

    /**
     * Adds a hover tile
     */
    addHover(): void {
        this.hover = new RoomTileHover(this.scene, this.coordinates, this.texture.key.concat('_hover'))
        this.hover.create()
    }

    /**
     * Destroys the hover tile
     */
    destroyHover(): void {
        if (this.hover !== undefined) {
            this.hover.destroy()
        }
    }

    static get width() {
        return 32
    }

    static get height() {
        return 32
    }
}