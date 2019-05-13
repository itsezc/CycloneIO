// @flow
import RoomModel from './model'
import FurnitureImager from '../furniture/imager'
import Furniture from '../furniture/furniture'
import Environment from '../../environment'

export default class Room {
    +id: number
    +model: RoomModel	
    +floorThickness: number
    +wallThickness: number
    +wallHeight: number
    +hideWalls: boolean
    +items: Object[]

    constructor(id: number, model: RoomModel, floorThickness: number, wallThickness: number, wallHeight: number, hideWalls: boolean, items: []) {
        this.id = id
        this.model = model
        this.floorThickness = floorThickness
        this.wallThickness = wallThickness
        this.wallHeight = wallHeight
        this.hideWalls = hideWalls
        //this.items = items
    }

    static load(socket: Object, id: number) {
        socket.join(id)
        socket.room = id

        let model = new RoomModel([[1, 1, 1], [1, 1, 1], [1, 1, 1]])
        let room = new Room(0, model, 2, 2, 2, false, [])

        /*[
            { id: 1, name: 'Test', description: 'Test 2', spriteName: '', type: 'floor', width: 1, length: 1, height: 0, canStack: true, canStand: false,  false }
            { id: 1, x: 1, y: 1, z: 0, rotation: 0, inventory: false, instance: 1 }
        ]*/

        Environment.instance.server.io.to(id).emit('newRoom', room)


        var imager = new FurnitureImager()

        imager.getFurniture(3081).then((data => {
            let furniture = new Furniture(0, data.name, data.classname, 'description', 'floor', 1, 1, 0, true, true, false, false, false)
            Environment.instance.server.io.to(id).emit('newFurniture', furniture.spriteName)
            console.log(furniture)
        }))
    }
}
