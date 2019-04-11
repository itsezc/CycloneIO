import RoomModel from './model'

export default class Room {
  constructor(id, map) {
    this.id = id
    this.map = map

    this.init()
  }

  init(){
    this.model = new RoomModel(this.id, this.map)
    this.model.init()
  }
}
