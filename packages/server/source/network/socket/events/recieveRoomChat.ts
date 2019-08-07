import SocketIO from 'socket.io'

export const recieveRoomChat = (socket: SocketIO.Socket, data: any, IO?: SocketIO.Socket) => {
	console.log(data)
}

export default recieveRoomChat;