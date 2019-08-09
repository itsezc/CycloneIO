import { RoomWithPlayers } from '../../../hotel/rooms/RoomManager'

export interface CycloneSocket extends SocketIO.Socket {
    cyclone: {
        username: string;
        figure: string;
        currentRoom: RoomWithPlayers | null;
    }
}