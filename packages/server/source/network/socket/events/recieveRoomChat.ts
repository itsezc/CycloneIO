import SocketIO from 'socket.io'
import {CycloneSocket} from '../types/cycloneSocket'


export const recieveRoomChat = (socket: CycloneSocket, data: any, IO?: SocketIO.Socket) => {
	console.log(data)
}

export default recieveRoomChat;