// @flow
import Room from './room'

export default class RoomManager {
	
  rooms: { [number]: Room }

  constructor() {
    this.rooms = {}
  }

  add(room: Room) {
    this.rooms[room.id] = room
  }

  roomByID(id: number) {
    return this.rooms[id]
  }
}
