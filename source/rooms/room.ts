import Phaser, { Scene, Cameras, Input, Structs } from 'phaser'

import Engine from '../engine'

import RoomModel from './model'
import RoomAvatar from './avatar'
import RoomPet, { DEFAULT_SIZE } from './pets/pet'

import TileGenerator from '../generators/tile'

export default class Room extends Scene {

    private camera: Cameras.Scene2D.Camera

    private model: RoomModel
    private player: RoomAvatar
    private pet: RoomPet

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

            // const look = 'ca-1815-92.sh-290-62.hd-180-1009.ch-262-64.ha-3763-63.lg-280-1193.hr-831-54' as const
            // const coordinates = { x: 0, y: 0, z: 0 } as const

            // this.player = new RoomAvatar(this, coordinates, look, false, 0, { head: Directions.FRONT_RIGHT, body: Directions.FRONT_RIGHT })

            // console.info({ roomPlayer: this.player }, 'loaded')

            const petData = {
                x: 0,
                y: -4,
                z: 0,
                direction: 2,
                animation: 3
            } as const

            const { x, y, z, direction, animation } = petData

            var coordinates = new Phaser.Math.Vector3(x, y, z)

            this.pet = new RoomPet(this, 'horse', DEFAULT_SIZE, coordinates, direction, animation)

            this.add.existing(this.pet)

            console.info({ roomPet: this.pet }, 'loaded')

            console.info({ room: this }, 'loaded')

        })
    }

    private registerInputEvents(): void {
        this.input.on('pointermove', this.scrollCamera, this)
    }

    private scrollCamera(pointer: Input.Pointer): void {

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

    private adjustCamera(gameSize: Structs.Size): void {
        const { width, height } = gameSize

        this.cameras.resize(width, height)
    }

    public get Engine(): Engine {
        return this.engine
    }
}