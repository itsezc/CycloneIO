import {injectable} from "inversify";

import IRoomManager from "./IRoomManager";
import IRoom from "./IRoom";
import RoomData from "./data/IRoomData";
import Room from "./Room";
import HabboContainer from "../injectors/HabboContainer";
import Habbo from "../Habbo";

@injectable()
export default class RoomManager implements IRoomManager {

	private currentRoom: IRoom

	public leaveRoom(): void {
	}

	public setRoom(room: IRoom): void {
		this.currentRoom = room

		const habbo = HabboContainer.get(Habbo)
		habbo.setScene(this.currentRoom)
	}

	public createRoom(roomData: RoomData): IRoom {
		return new Room(roomData);
	}

}
