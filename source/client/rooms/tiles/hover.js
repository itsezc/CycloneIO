// @flow

import Phaser, { Textures } from 'phaser'

const { Texture } = Textures

import GameSprite from '../../games/sprite'
import Room from '../room'

import type { Vector } from '../../../common/types/rooms/vector'

import RoomModelDepth from '../../../common/enums/rooms/models/depth'


/**
 * RoomTileHover class
 * @extends GameSprite
 */
export default class RoomTileHover extends GameSprite {

    +scene: Room
    +coordinates: Vector
    +texture: Texture

    /**
     * @param {Room} scene
     * @param {Vector} cordinates - The coordinates of the hover tile
     * @param {Texture} texture - The hover tile texture
     */
    constructor(scene: Room, coordinates: Vector, texture: Texture) {

        super(scene, coordinates, RoomModelDepth.TILE_HOVER, texture)
        
        this.scene = scene
        this.coordinates = coordinates
        this.texture = texture

    }

    /**
     * Creates the hover tile
     */
    create(): void {

        super.create()
        this.setPosition(this.isometricCoords.x - 1, this.isometricCoords.y - 4)

    }
}