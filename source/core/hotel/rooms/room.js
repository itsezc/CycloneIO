// @flow
import RoomModel from './model'

import Environment from '../../../environment'

export default class Room {
    +id: number
    +model: RoomModel
    +floorThickness: number
    +wallThickness: number
    +wallHeight: number
    +hideWalls: boolean;

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
    }
}
