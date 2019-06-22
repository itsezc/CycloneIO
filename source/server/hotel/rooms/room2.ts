
import RoomModel from './model'

import FurnitureImager from '../furniture/imager'
import Furniture from '../furniture/furniture'

import Environment from '../../environment2'

import Item from '../furniture/item'

import SocketIO from 'socket.io'

/**
 * Room class
 */
export default class Room {

	public id: number
	private model: RoomModel	
	private floorThickness: number
	private wallThickness: number
	private wallHeight: number
	private hideWalls: boolean
	private items: Item[]

	/**
	 * @param {number} id - The room ID
	 * @param {RoomModel} model - The room model
	 * @param {number} floorThickness - The floor thickness
	 * @param {number} wallThickness - The wall thickness
	 * @param {number} wallHeight - The wall height
	 * @param {boolean} hideWalls - Sets whether the walls are hidden or not
	 * @param {Item} items - The rooms items
	 */
	public constructor(id: number, model: RoomModel, floorThickness: number, wallThickness: number, wallHeight: number, hideWalls: boolean, items: Item[]) {
		
		this.id = id
		this.model = model
		this.floorThickness = floorThickness
		this.wallThickness = wallThickness
		this.wallHeight = wallHeight
		this.hideWalls = hideWalls
		this.items = items
	}

	/**
	 * Loads the room
	 * @param {SocketIO} socket - The socket connection
	 * @param {number} id - The room id
	*/
	public static load(socket: SocketIO.Socket, id?: number): void {

		socket.join('room1')

		let model: RoomModel = new RoomModel([[1, 1]])
		//let room: Room = new Room(0, model, 2, 2, 2, false, [])

		/*[
			{ id: 1, name: 'Test', description: 'Test 2', spriteName: '', type: 'floor', width: 1, length: 1, height: 0, canStack: true, canStand: false,  false }
			{ id: 1, x: 1, y: 1, z: 0, rotation: 0, inventory: false, instance: 1 }
		]*/

		Environment.instance.server.webSocket.to('room1').emit('newRoom', model.map)

		var imager = new FurnitureImager()

		imager.getFurniture(230).then((data: any) => {
			
			let furniture = new Furniture(0, data.name, data.classname, 'description', 'floor', 1, 1, 0, true, true, false, false, false)
			Environment.instance.server.webSocket.to('room1').emit('newItem', furniture.spriteName)
			console.log(furniture)
		})

		// Users Database
		let Users = [
			{ id: 0, name: 'EZ-C', figure: 'EZ-C' }
		]
		
		Environment.instance.server.webSocket.to('room1').emit('', Users)
	}
}