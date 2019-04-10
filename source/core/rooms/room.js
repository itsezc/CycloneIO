import RoomModel from './model'

class Room extends RoomModel {
  constructor(map, door, id) {
    super(map, door.X, door.Y)
    this.id = id
  }
}

export default Room
