import { prisma } from '../../../../../storage/prisma'
import { RoomManager, RoomWithPlayers, PlayerInfo } from '../../../hotel/rooms/RoomManager'
import {CycloneSocket} from '../types/cycloneSocket'

export const joinRoom = async (socket: CycloneSocket, id: any, IO?: SocketIO.Server) => {

	if (!id) return;
    
	let manager: RoomManager = RoomManager.getInstance()

	let room: RoomWithPlayers = await manager.getRoom(id)

	if (room && room.roomData) {

		let randomX = Math.floor(Math.random() * 5)
		let randomY = Math.floor(Math.random() * 5)

		let avatarData = {
			x: randomX,
			y: randomY,
			z: 0
		}

		let added = manager.addPlayer(
			room, {
				socketId: socket.id,
				avatarData
			}
		)

		if (added) {
			// If the socket is in a room it should leave it
			let currentRoom: string = socket.rooms[room.roomData.id]

			if (currentRoom) {
				socket.leave(currentRoom)
			}

			//socket.rooms[id] = room.roomData.id

			socket.join(room.roomData.id)

			// We set the room object to our custom socket data
			socket.cyclone.currentRoom = room
            
			socket.emit('setRoom', room)

			IO.to(room.roomData.id).emit('playerJoined', {
				socketId: socket.id,
				avatarData
			})
		}

	}
}

export default joinRoom;
