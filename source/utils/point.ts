import { Geom } from 'phaser'

import { Vector2D } from '../types/vector'

export const coordinatesToIsometric = (coordinates: Vector2D): Geom.Point => {
    const { x, y } = coordinates

    let isometricX = (x - y) * 32
    let isometricY = (x + y) * 16

    return new Geom.Point(isometricX, isometricY)
}