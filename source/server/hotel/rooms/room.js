import RoomMap from './map'

class Room extends RoomMap {
	constructor(id, map, door) {
		super(id, map, door.X, door.Y)
		this.id = id
		this.map = map
		this.door = door
	}
}

export default Room