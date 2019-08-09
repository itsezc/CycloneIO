import SocketIO from 'socket.io'
import {CycloneSocket} from '../types/cycloneSocket'

export const requestHotelView = (socket: CycloneSocket, data: any, IO?: SocketIO.Socket) => {
    socket.emit('renderHotelView')
}

export default requestHotelView;