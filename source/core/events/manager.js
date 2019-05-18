// @flow
import SocketIO from 'socket.io'
import Room from '../../hotel/rooms/room'
import RoomPlayer from '../../hotel/rooms/player'

export default class EventManager {
    socket: SocketIO

    constructor(socket: SocketIO) {
        this.socket = socket

        this.registerRooms()
        this.registerPlayers()
    }

    registerRooms() {
        this.socket.on('newRoom', id => {
            Room.load(this.socket, id)
        })
    }

    registerPlayers() {
        this.socket.on('disconnect', () => {
            RoomPlayer.disconnect(this.socket.room, this.socket.id)
        })
    }
}
