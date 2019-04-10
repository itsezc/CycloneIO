export default class RoomManager {
  constructor(){
    this.rooms = []
  }

  add(room){
    this.rooms.push(room)
    //console.log(room.model.mapSizeY)
    //room.model.create()
  }
}
