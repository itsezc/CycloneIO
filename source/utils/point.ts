import { Geom } from 'phaser'

export const coordinatesToIsometric = (coordinates: Geom.Point): Geom.Point => {
    const { x, y } = coordinates

    let isometricX = (x - y) * 32
    let isometricY = (x + y) * 16

    return new Geom.Point(isometricX, isometricY)
}