import {injectable} from "inversify";

import IRoomManager from "./IRoomManager";
import RoomScene from "./RoomScene";
import RoomData from "./data/RoomData";
import Room from "./Room";
import HabboContainer from "../injectors/HabboContainer";
import Habbo from "../Habbo";

@injectable()
export default class RoomManager implements IRoomManager {

	private currentRoom: RoomScene

	public leaveRoom(): void {
	}

	public setRoom(room: RoomScene): void {
		this.currentRoom = room

		const habbo = HabboContainer.get(Habbo)
		habbo.setScene(this.currentRoom)
	}

	public createRoom(roomData: RoomData): RoomScene {
		return new Room(roomData);
	}

}
