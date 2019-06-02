import RoomEntity from './entity'
import RoomModel from './model'
import Room from './room'

import Environment from '../../environment'
import Logger from '../../../utils/logger'

/**
 * RoomPlayer class
 * @extends {RoomEntity}
 */
export default class RoomPlayer extends RoomEntity {

	/**
     * Disconnect a player
     * @param {number} room - The room ID
     * @param {number} id - The player ID
     */
    static disconnect(id: string) {
		// if (RoomPlayer.list[socket.room]) {
		// 	delete RoomPlayer.list[socket.room][socket.id]
		// }

        Environment.instance.server.webSocket.to('room1').emit('removePlayer', id)
        Logger.network(`Player ${id} disconnected`)
	}
	
	// constructor(id: number, position) {
	// 	super(id, position.x, position.y)
	// 	this.direction = position.direction
	// }

	// updatePosition(position) {
	// 	this.x = position.x
	// 	this.y = position.y
	// }

	// update(direction, position) {
	// 	this.updatePosition(position)
	// 	this.direction = direction
	// }
}

// RoomPlayer.list = {}
// RoomPlayer.list[0] = {}
