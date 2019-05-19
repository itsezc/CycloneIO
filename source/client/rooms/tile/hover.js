import RoomSprite from '../sprite'

export default class RoomTileHover extends RoomSprite {

    constructor(scene, x, y, z, texture, width, height, depth) {
        
        super(scene, x, y, z, texture, width, height, depth)

        this.create()

    }

    create() {

        super.create()

        console.log(this.x, this.y)


        //this.setPosition(this.isometric.x, this.isometric.y / 4)

    }
}