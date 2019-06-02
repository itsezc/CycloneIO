import RoomData from './room'

export default class RoomManager {
	
	private rooms!: RoomData[]

	public add(room: RoomData): void {
		this.rooms[room.id] = room
	}

	public roomByID(id: number): RoomData {
		return this.rooms[id]
	}
}
