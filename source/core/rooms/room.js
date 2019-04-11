import RoomModel from './model'

export default class Room {
  constructor(id, map, options) {
    this.id = id
    this.model = new RoomModel(map, options)
  }
}
