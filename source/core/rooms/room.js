import RoomMap from './map'

class Room extends RoomMap {
  constructor(id, map, door) {
    super(map, door.X, door.Y)
    this.id = id
  }
}

Room.list = {}

export default Room
