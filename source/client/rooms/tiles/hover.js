import RoomSprite from '../sprite'

export default class RoomTileHover extends RoomSprite {

    constructor(scene, x, y, z, texture, depth) {

        super(scene, x, y, z, texture, depth)

        this.create()

    }

    create() {

        super.create()

        this.setPosition(this.x - 1, this.y - 4)

    }
}