// @flow
import RoomModel from './model'
import ItemImager from '../items/imager'
import Item from '../items/item'
import Environment from '../../../environment'

export default class Room {
    +id: number
    +model: RoomModel
    +floorThickness: number
    +wallThickness: number
    +wallHeight: number
    +hideWalls: boolean

    constructor(id: number, model: RoomModel, floorThickness: number, wallThickness: number, wallHeight: number, hideWalls: boolean) {
        this.id = id
        this.model = model
        this.floorThickness = floorThickness
        this.wallThickness = wallThickness
        this.wallHeight = wallHeight
        this.hideWalls = hideWalls
    }

    static load(socket: Object, id: number){
        socket.join(id)
        socket.room = id

        let model = new RoomModel([[1, 1, 1], [1, 1, 1], [1, 1, 1]])
        let room = new Room(0, model, 2, 2, 2, false)

        Environment.instance.server.io.to(id).emit('newRoom', room)

        var imager = new ItemImager()

        imager.getItem(3081).then((data => {
            let item = new Item(0, parseInt(data.id), data.name, data.classname, 'floor', 1, 1, 0, true, false, false)
            Environment.instance.server.io.to(id).emit('newItem', item.spriteName)
            console.log(item)
        }))
    }
}
