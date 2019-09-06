import IEvent from '../IEvent'
import UserEventData from './data/UserEventData'
import HabboContainer from '../../../injectors/HabboContainer'
import IRoomManager from '../../../rooms/IRoomManager'
import RoomData from '../../../rooms/data/RoomData'

interface EventData {
	players: UserEventData[]
	roomData: RoomData
}

export class SetRoomEvent implements IEvent {
	private roomManager: IRoomManager

	public execute(data: EventData): void {
		const roomManager = HabboContainer.get<IRoomManager>('IRoomManager')
		const room = roomManager.createRoom(data.roomData)

		roomManager.setRoom(room)
	}
}
