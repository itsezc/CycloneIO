import IEvent from "../IEvent"
import IUserEventData from "./IUserEventData"
import HabboContainer from "../../../injectors/HabboContainer";
import IRoomManager from "../../../rooms/IRoomManager";
import RoomData from "../../../rooms/data/IRoomData";

interface EventData {
	players: IUserEventData[]
	roomData: RoomData
}

export class SetRoomEvent implements IEvent {
	public execute(data: EventData): void {
		const roomManager = HabboContainer.get<IRoomManager>('IRoomManager')
		const room = roomManager.createRoom(data.roomData)

		roomManager.setRoom(room)
	}
}
