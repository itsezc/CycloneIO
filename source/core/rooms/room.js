import RoomModel from './model'

export default class Room {
  constructor(id, map, properties) {
    this.id = id
	this.properties = properties
    this.model = new RoomModel(map)
  }
}
