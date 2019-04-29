// @flow
import RoomEntity from './entity'
import Room from './room'

import Environment from '../../environment'
import Logger from '../../utils/logger'

export default class RoomPlayer extends RoomEntity {
  static onConnect(socket: Object) {
    let player

    socket.on('newRoom', () => {
      const id = 0 // To make this dynamic

      socket.join(id)
      socket.room = id

      let room = new Room(id, {
        floor: {
          thickness: 7.5
        }
      })

      Environment.instance.roomManager.add(room)

      Environment.instance.server.socketIO
        .to(id)
        .emit('newRoom', [[1]], room.properties.floor.thickness)
    })

    // socket.on('newPlayer', (room, position) => {
    // 	socket.join(room)
    // 	socket.room = room

    // 	player = new RoomPlayer(socket.id, position)
    // 	RoomPlayer.list[room][socket.id] = player

    // 	var players = []

    // 	for (var i in RoomPlayer.list[room]) {
    // 		players.push(RoomPlayer.list[room][i])
    // 	}

    // 	socket.emit(Constants.common.actions.player.ALL_PLAYERS, players)

    // 	socket.broadcast.to(room).emit(Constants.common.actions.player.NEW_PLAYER, player)
    // })
    //
    // socket.on(Constants.common.actions.player.CHAT, (message) => {
    //   socketIO.to(socket.room).emit(CHAT, socket.id.substring(0, 5), message)
    // })
    //
    // socket.on(Constants.common.actions.player.MOVE, (direction, position) => {
    //   player.update(direction, position)
    //   socketIO.to(socket.room).emit(Constants.common.actions.player.PLAYER_MOVED, player)
    // })
    //
    // socket.on(Constants.common.actions.player.STOP, (position) => {
    //   player.updatePosition(position)
    //   socket.broadcast.to(socket.room).emit(Constants.common.actions.player.STOP, player)
    // })

    Logger.network(`User (${socket.id}) connected`)
  }

  static onDisconnect(socket: Object) {
    // if (RoomPlayer.list[socket.room]) {
    // 	delete RoomPlayer.list[socket.room][socket.id]
    // }

    Environment.instance.server.socketIO
      .to(socket.room)
      .emit('remove', socket.id)

    Logger.network(`User (${socket.id}) disconnected`)
  }

  // constructor(id: number, position) {
  // 	super(id, position.x, position.y)
  // 	this.direction = position.direction
  // }

  // updatePosition(position) {
  // 	this.x = position.x
  // 	this.y = position.y
  // }

  // update(direction, position) {
  // 	this.updatePosition(position)
  // 	this.direction = direction
  // }
}

// RoomPlayer.list = {}
// RoomPlayer.list[0] = {}
