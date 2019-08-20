import IEvent from "../IEvent";
import IUserEventData from "./IUserEventData";

export class PlayerJoinedEvent implements IEvent {
	public execute(data: IUserEventData): void {
		console.log(data)
	}
}
