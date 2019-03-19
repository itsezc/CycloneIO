import RoomEntity from './entity'
import { NEW_ROOM } from '../../../common/constants/room'
import Room from './room'
import { NEW_PLAYER, ALL_PLAYERS, CHAT, MOVE, PLAYER_MOVED, STOP, REMOVE } from '../../../common/constants/actions/player'

class RoomPlayer extends RoomEntity {
	static onConnect(io, socket) {
		let room
		let player

		socket.on(NEW_ROOM, (id, map) => {
			room = new Room(id, map)
			this.rooms.push(room)

			socket.broadcast.to(id).emit(NEW_ROOM, room)
		})

		socket.on(NEW_PLAYER, (roomID, position) => {
			socket.join(roomID)
			socket.room = roomID

			player = new RoomPlayer(socket.id, position)

			this.players.push(player)

			socket.emit(ALL_PLAYERS, this.players)

			socket.broadcast.to(roomID).emit(NEW_PLAYER, player)
		})

		socket.on(CHAT, (message) => {
			io.to(socket.room).emit(CHAT, socket.id.substring(0, 5), message)
		})

		socket.on(MOVE, (direction, position) => {
			player.update(direction, position)
			io.to(socket.room).emit(PLAYER_MOVED, player)
		})

		socket.on(STOP, (position) => {
			player.updatePosition(position)
			socket.broadcast.to(socket.room).emit(STOP, player)
		})
	}

	static onDisconnect(io, socket) {
		delete this.players[socket.id]
		io.to(socket.room).emit(REMOVE, socket.id)
	}

	constructor(id, position) {
		super(id, position.x, position.y)
		this.direction = position.direction
	}

	updatePosition(position) {
		this.x = position.x
		this.y = position.y
	}

	update(direction, position) {
		this.updatePosition(position)
		this.direction = direction
	}
}

export default RoomPlayer
