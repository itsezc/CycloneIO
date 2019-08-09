import { RoomManager, RoomWithPlayers, PlayerInfo } from '../../../hotel/rooms/RoomManager' 
import {CycloneSocket} from '../types/cycloneSocket'


export const disconnect = async (socket: CycloneSocket, id: any, IO?: SocketIO.Server) => {

    let manager: RoomManager = RoomManager.getInstance()

    if(socket.cyclone.currentRoom) {

        let roomId = socket.cyclone.currentRoom.roomData.id

        let removed = manager.removePlayer(socket.id, roomId)

        if(removed) {
            IO.to(roomId).emit('playerLeft', socket.id)
        }
    }

}

export default disconnect