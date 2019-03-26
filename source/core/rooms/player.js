import RoomEntity from './entity'
import Constants from '../../network/constants.json'
import Room from './room'

class RoomPlayer extends RoomEntity {
  static onConnect(socketIO, socket) {
    let room
    let player

    socket.on(Constants.common.actions.room.NEW_ROOM, (id, map) => {
      socket.join(id)
      socket.room = id

    	room = new Room(id, map, { x: 0, y: 0 })
    	Room.list[id] = room

    	socketIO.sockets.in(id).emit(Constants.common.actions.room.NEW_ROOM, room, room.rows, room.columns)
    })

    socket.on(Constants.common.actions.player.NEW_PLAYER, (roomID, position) => {
      socket.join(roomID)
      socket.room = roomID

      player = new RoomPlayer(socket.id, position)
      RoomPlayer.list[roomID][socket.id] = player

      let players = []

      for (let i in RoomPlayer.list[roomID]) {
        players.push(RoomPlayer.list[roomID][i])
      }

      socket.emit(Constants.common.actions.player.ALL_PLAYERS, players)

      socket.broadcast.to(roomID).emit(Constants.common.actions.player.NEW_PLAYER, player)
    })

    socket.on(Constants.common.actions.player.CHAT, (message) => {
      socketIO.to(socket.room).emit(CHAT, socket.id.substring(0, 5), message)
    })

    socket.on(Constants.common.actions.player.MOVE, (direction, position) => {
      player.update(direction, position)
      socketIO.to(socket.room).emit(Constants.common.actions.player.PLAYER_MOVED, player)
    })

    socket.on(Constants.common.actions.player.STOP, (position) => {
      player.updatePosition(position)
      socket.broadcast.to(socket.room).emit(Constants.common.actions.player.STOP, player)
    })
  }

  static onDisconnect(socketIO, socket) {
    if (RoomPlayer.list[socket.room]) {
      delete RoomPlayer.list[socket.room][socket.id]
    }

    socketIO.to(socket.room).emit(Constants.common.actions.player.REMOVE, socket.id)
  }

  constructor(id, position) {
    super(id, position.x, position.y)
    this.direction = position.direction
  }

  updatePosition(position) {
    this.x = position.x
    this.y = position.y
  }

  update(direction, position) {
    this.updatePosition(position)
    this.direction = direction
  }
}

RoomPlayer.list = {}
RoomPlayer.list[0] = {}

export default RoomPlayer
