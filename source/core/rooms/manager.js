export default class RoomManager {
	constructor() {
		this.rooms = {}
	}

	add(room) {
		this.rooms[room.id] = room
	}

	roomByID(id) {
		return this.rooms[id]
	}
}
