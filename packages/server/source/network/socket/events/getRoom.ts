import { prisma } from '../../../../../storage/prisma'

export const getRoom = async (socket: any, data: any) => {
    let room = await prisma.room({
        id: data
    })

    if(room)
        socket.emit('setRoom', room)
}

export default getRoom;