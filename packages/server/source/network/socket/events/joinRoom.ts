import { prisma } from '../../../../../storage/prisma'

export const joinRoom = async (socket: SocketIO.Socket, id: any, IO?: SocketIO.Server) => {
    let room = await prisma.room({
        id
    })

    // console.log(IO)

    if (room) {
        
        // If the socket is in a room it should leave it
        if(socket.room) {
            socket.leave(socket.room)
        }

        socket.join(room.id)

        socket.emit('setRoom', room)

        IO.to(room.id).emit('playerJoined', 'somePlayerData')

    }
}

export default joinRoom;