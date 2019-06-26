/*  colors -> 6 colors (thickness top...)
    pass each color and set it 
    (needs an update function in case 
    users change it in real time) 
    
    colors -> Map value -> part, hex ('top', [0xFF0000, 0xffff]) -> 
    1st: fill color
    2nd stroke color 
    
    Sometimes you need a texture so colors are ignored 
    
    no colors -> texture
    no texture -> colors
    
    for each key value set a color on the selected part (stroke and fill)

    thickness -> create each separated part and redraw it on update (destroy and recreate)


*/

/* import IGameObject from '../../games/object'

import Room from '../room'

import Vector from '../../../common/types/rooms/vector'
import RoomObjectDepth from '../../../common/enums/rooms/objects/depth'

export default class RoomTile extends Phaser.GameObjects.Container implements IGameObject
{
    public readonly scene: Room
    private readonly coordinates: Vector
    private readonly thickness: number
    private readonly partColors?: { top: { fill: number, stroke: number }, 
                                    left: { fill: number, stroke: number },
                                    bottom: { fill: number, stroke: number } }
    private readonly texture?: string
    private readonly tileWidth: number

    private cartesianCoords!: Vector
    private isometricCoords!: Vector

    public id!: number
    private surface!: Phaser.GameObjects.Graphics
    private leftThickness!: Phaser.GameObjects.Graphics
    private bottomThickness!: Phaser.GameObjects.Graphics

    private surfacePolygon!: Phaser.Geom.Polygon
    private leftThicknessPolygon!: Phaser.Geom.Polygon
    private bottomThicknessPolygon!: Phaser.Geom.Polygon

    constructor(scene: Room, coordinates: Vector, thickness: number,
                partColors?: { top: { fill: number, stroke: number }, 
                               left: { fill: number, stroke: number },
                               bottom: { fill: number, stroke: number } }, texture?: string)
    {
        super(scene)

        this.scene = scene
        this.coordinates = coordinates
        this.thickness = thickness
        this.partColors = partColors
        this.texture = texture
        this.tileWidth = 64

        this.create()
    }

    create(): void
    {
        this.setDepth(RoomObjectDepth.TILE)

        this.cartesianCoords = this.scene.coordsToCartesian(this.coordinates)
        this.isometricCoords = this.scene.cartesianToIsometric(this.cartesianCoords)

        this.surface = new Phaser.GameObjects.Graphics(this.scene)
        this.add(this.surface)

        this.drawSurface()

        if (this.thickness > 0)
        {
            this.leftThickness = new Phaser.GameObjects.Graphics(this.scene)
            this.bottomThickness = new Phaser.GameObjects.Graphics(this.scene)

            this.add([this.leftThickness, this.bottomThickness])

            this.drawLeftThickness()
            this.drawBottomThickness()
        }
    }

    drawSurface(): void
    {
        this.surfacePolygon = new Phaser.Geom.Polygon(
            [
                new Phaser.Geom.Point(this.isometricCoords.x, this.isometricCoords.y),
                new Phaser.Geom.Point(this.isometricCoords.x + this.tileWidth / 2, this.isometricCoords.y - this.tileWidth / 4),
                new Phaser.Geom.Point(this.isometricCoords.x + this.tileWidth, this.isometricCoords.y),
                new Phaser.Geom.Point(this.isometricCoords.x + this.tileWidth / 2, this.isometricCoords.y + this.tileWidth / 4)
            ])
        
        if (this.partColors)
        {
            this.surface.fillStyle(this.partColors.top.fill)
            this.surface.fillPoints(this.surfacePolygon.points)

            this.surface.lineStyle(0.5, this.partColors.top.stroke)
            this.surface.strokePoints(this.surfacePolygon.points, true)
        }
    }

    drawLeftThickness(): void
    {

    }

    drawBottomThickness(): void
    {

    }
} */