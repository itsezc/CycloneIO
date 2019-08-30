import RoomScene from './RoomScene'
import RoomData from './data/RoomData'

export default interface IRoomManager {
	setRoom(room: RoomScene): void
	leaveRoom(): void
	createRoom(roomData: RoomData): RoomScene
}
