// @flow
import RoomEntity from './entity'
import RoomModel from './model'
import Room from './room'

import Environment from '../../../environment'
import Logger from '../../../utils/logger'

export default class RoomPlayer extends RoomEntity {
    static onConnect(socket: Object) {
        socket.on('newRoom', id => {
            socket.join(id)
            socket.room = id

            let model = new RoomModel([[1], [1, 1]])
            let room = new Room(id, model, 7.5, 7.5, 120, false)

            Environment.instance.server.io.to(id).emit('newRoom', room)
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

    static disconnect(room: number, id: number) {
        // if (RoomPlayer.list[socket.room]) {
        // 	delete RoomPlayer.list[socket.room][socket.id]
        // }

        Environment.instance.server.io.to(room).emit('removePlayer', id)

        Logger.network(`Player ${id} disconnected`)
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
