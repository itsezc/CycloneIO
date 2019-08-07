import { prisma } from '../../../../../storage/prisma'
import { RoomManager, RoomWithPlayers, PlayerInfo } from '../../../hotel/rooms/RoomManager'

export const sendRoomChat = async (socket: SocketIO.Socket, data: any, IO?: SocketIO.Server) => {

    let manager: RoomManager = RoomManager.getInstance()


    const { roomId, from, body } = data
    // let room: RoomWithPlayers = await manager.getRoom(roomId)

    // if (room) {

    //     let added = manager.addChat(socket.id, room)

    //     if (added) {

            console.log('Chat handler', from, body)
            
            IO/*.to(roomId)*/.emit('recieveRoomChat', {
                // socketId: socket.id,
				from,
				body
            })
    //     }

    // }
}

export default sendRoomChat