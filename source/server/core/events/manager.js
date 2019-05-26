// @flow

import SocketIO from 'socket.io'
import Room from '../../hotel/rooms/room'
import RoomPlayer from '../../hotel/rooms/player'

/**
 * EventManager class
 */
export default class EventManager {

    socket: SocketIO

    /**
     * @param {SocketIO} socket - The socket connection
     */
    constructor(socket: SocketIO) {
        this.socket = socket

        this.registerRooms()
        this.registerPlayers()
    }

    /**
     * Registers rooms events
     */
    registerRooms(): void {
        this.socket.on('newRoom', id => {
            Room.load(this.socket, id)
        })
    }

    /**
     * Registers player events
     */
    registerPlayers(): void {
        this.socket.on('disconnect', () => {
            RoomPlayer.disconnect(this.socket.room, this.socket.id)
        })
    }
}
