import SocketIO from 'socket.io'

export const requestHotelView = (socket: SocketIO.Socket, data: any, IO?: SocketIO.Socket) => {
    socket.emit('renderHotelView')
}

export default requestHotelView;