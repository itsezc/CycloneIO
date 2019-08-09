import { RoomManager, RoomWithPlayers, PlayerInfo } from '../../../hotel/rooms/RoomManager' 
import {CycloneSocket} from '../types/cycloneSocket'


export const move = async (socket: CycloneSocket, data: any, IO?: SocketIO.Server) => {


    if(socket.cyclone.currentRoom) {


        IO.to(socket.cyclone.currentRoom.roomData.id).emit('playerMoved', {
            socketId: socket.id,
            coords: data
        })

    }
    
}

export default move