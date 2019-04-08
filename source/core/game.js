import RoomManager from './rooms/manager'

class Game {
  static get RoomManager(){
    return new RoomManager()
  }
}

export default Game
