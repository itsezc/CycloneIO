import IEvent from "../IEvent";
import UserEventData from "./data/UserEventData";

export class PlayerJoinedEvent implements IEvent {
	public execute(data: UserEventData): void {
		console.log(data)
	}
}
