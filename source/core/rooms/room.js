import RoomModel from './model'

export default class Room {
  constructor(id, map, options) {
    this.id = id
    this.map = map
    this.model = new RoomModel(this.map, options)
  }
}
