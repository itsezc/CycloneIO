import SocketIO from 'socket.io'

export const requestHotelView = (socket: SocketIO.Socket, data: any) => {
    socket.emit('renderHotelView')
}

export default requestHotelView;