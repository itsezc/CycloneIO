import Size from '../types/size'

import Engine from '../engine'

import RoomModel from './model'

import TileGenerator from '../generators/tile'

export default class Room extends Phaser.Scene {

    private camera: Phaser.Cameras.Scene2D.Camera
    private model: RoomModel

    public constructor(private readonly id: string, private readonly engine: Engine) {
        super({ key: id })

        this.id = id
        this.engine = engine
    }

    public init() {
        this.camera = this.cameras.main

        this.camera.centerOn(this.camera.midPoint.x / this.camera.width, this.camera.midPoint.y / this.camera.height)

        this.registerInputEvents()
        this.registerScaleEvents()
    }

    public create(): void {

        const heightmap = [[
            0, 0, 0, 0, 0
        ], [
            0, 0, 0, 0, 0
        ], [
            0, 0, 0, 0, 0
        ], [
            0, 0, 0, 0, 0
        ]]

        let tile = new TileGenerator({
            image: {
                width: 65,
                height: 40
            }
        })

        this.textures.addBase64('tile', tile.generate())

        this.textures.once('addtexture', () => {

            this.model = new RoomModel(this, heightmap)

            console.info({ roomModel: this.model }, 'ready')

        })

        console.info({ tile: tile }, 'loaded')
    }

    private registerInputEvents(): void {
        this.input.on('pointermove', this.scrollCamera, this)
    }

    private scrollCamera(pointer: Phaser.Input.Pointer): void {

        const { camera } = pointer

        if (pointer.primaryDown) {

            camera.scrollX += (pointer.downX - pointer.x) / camera.zoom
            pointer.downX = pointer.x

            camera.scrollY += (pointer.downY - pointer.y) / camera.zoom
            pointer.downY = pointer.y

        }
    }

    private registerScaleEvents(): void {
        this.scale.on('resize', this.adjustCamera, this)
    }

    private adjustCamera(gameSize: Size): void {
        const { width, height } = gameSize

        this.cameras.resize(width, height)
    }
}