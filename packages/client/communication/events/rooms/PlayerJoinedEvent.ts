import IEvent from "../IEvent";
import IPoint from "../../../rooms/coordinates/IPoint";

interface EventData {
    socketId: string,
    position: IPoint
}

export class PlayerJoinedEvent implements IEvent {
    execute(data: EventData): void {
        console.log(data)
    }
}