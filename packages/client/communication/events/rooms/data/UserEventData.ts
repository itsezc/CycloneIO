import Point from "../../../../rooms/coordinates/Point";

export default interface UserEventData {
	socketId: string,
	position: Point
}
