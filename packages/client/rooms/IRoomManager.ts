import IRoom from "./IRoom";
import RoomData from "./data/IRoomData";

export default interface IRoomManager {
	setRoom(room: IRoom): void
	leaveRoom(): void
	createRoom(roomData: RoomData): IRoom
}
