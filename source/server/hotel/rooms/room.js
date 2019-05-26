// @flow

import RoomModel from './model'

import FurnitureImager from '../furniture/imager'
import Furniture from '../furniture/furniture'

import Environment from '../../environment'

import Item from '../furniture/item'

import SocketIO from 'socket.io'

/**
 * Room class
 */
export default class Room {

    +id: number
    +model: RoomModel	
    +floorThickness: number
    +wallThickness: number
    +wallHeight: number
    +hideWalls: boolean
    +items: Item[]

    /**
     * @param {number} id - The room ID
     * @param {RoomModel} model - The room model
     * @param {number} floorThickness - The floor thickness
     * @param {number} wallThickness - The wall thickness
     * @param {number} wallHeight - The wall height
     * @param {boolean} hideWalls - Sets whether the walls are hidden or not
     * @param {Item} items - The rooms items
     */
    constructor(id: number, model: RoomModel, floorThickness: number, wallThickness: number, wallHeight: number, hideWalls: boolean, items: Item[]) {
        
        this.id = id
        this.model = model
        this.floorThickness = floorThickness
        this.wallThickness = wallThickness
        this.wallHeight = wallHeight
        this.hideWalls = hideWalls
        //this.items = items
    }

    /**
     * Loads the room
     * @param {SocketIO} socket - The socket connection
     * @param {number} id - The room id
    */
    static load(socket: SocketIO, id: number): void {

        socket.join(id)
        socket.room = id

        let model = new RoomModel([[1, 1, 1], [0, 1]])
        let room = new Room(0, model, 2, 2, 2, false, [])

        /*[
            { id: 1, name: 'Test', description: 'Test 2', spriteName: '', type: 'floor', width: 1, length: 1, height: 0, canStack: true, canStand: false,  false }
            { id: 1, x: 1, y: 1, z: 0, rotation: 0, inventory: false, instance: 1 }
        ]*/

        Environment.instance.server.WebSocket.to(id).emit('newRoom', model.map)

        var imager = new FurnitureImager()

        imager.getFurniture(3081).then((data => {
            let furniture = new Furniture(0, data.name, data.classname, 'description', 'floor', 1, 1, 0, true, true, false, false, false)
            Environment.instance.server.WebSocket.to(id).emit('newFurniture', furniture.spriteName)
            console.log(furniture)
        }))
    }
}