import { GameObjects } from 'phaser'

import { Vector2D } from '../types/vector'

import { coordinatesToIsometric } from '../utils/point'

import Room from './room'

export default class RoomModel {

    private readonly tiles: GameObjects.Container

    public constructor(private readonly scene: Room, private readonly heightmap: number[][]) {
        this.scene = this.scene
        this.heightmap = heightmap

        this.tiles = new GameObjects.Container(this.scene)

        this.generate(this.heightmap)
    }

    private generate(heightmap: number[][]) {

        for (let y = 0; y < heightmap.length; y++) {

            for (let x = 0; x < heightmap[y].length; x++) {
                let isometricCoordinates = coordinatesToIsometric({ x, y })

                var tile = new GameObjects.Image(this.scene, isometricCoordinates.x, isometricCoordinates.y, 'tile')

                this.tiles.add(tile)
            }
        }

        this.scene.add.existing(this.tiles)
    }
}