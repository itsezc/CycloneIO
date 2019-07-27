import { prisma } from '../../../../../storage/prisma'
import { RoomManager, RoomWithPlayers, PlayerInfo } from '../../../hotel/rooms/RoomManager'

export const joinRoom = async (socket: SocketIO.Socket, id: any, IO?: SocketIO.Server) => {

    let manager: RoomManager = RoomManager.getInstance()

    let room: RoomWithPlayers = await manager.getRoom(id)

    if (room) {

        let randomX = Math.floor(Math.random() * 5);
        let randomY = Math.floor(Math.random() * 5);

        let avatarData = {
            x: 0,
            y: 0,
            z: 0
        }

        let added = manager.addPlayer(
            room, {
                socketId: socket.id,
                avatarData
            }
        )

        if (added) {
            // If the socket is in a room it should leave it
            let currentRoom: string = socket.rooms[room.roomData.id]

            if (currentRoom) {
                socket.leave(currentRoom)
            }

            //socket.rooms[id] = room.roomData.id

            socket.join(room.roomData.id)

            socket.emit('setRoom', room)

            IO.to(room.roomData.id).emit('playerJoined', {
                socketId: socket.id,
                avatarData
            })
        }

    }
}

export default joinRoom;