import { RoomManager, RoomWithPlayers, PlayerInfo } from '../../../hotel/rooms/RoomManager' 


export const disconnect = async (socket: SocketIO.Socket, id: any, IO?: SocketIO.Server) => {

    let manager: RoomManager = RoomManager.getInstance()

    let roomId = socket.currentRoom

    if(roomId) {
        let removed = manager.removePlayer(socket.id, roomId)

        if(removed) {
            IO.to(roomId).emit('playerLeft', socket.id)
        }
    }

}

export default disconnect