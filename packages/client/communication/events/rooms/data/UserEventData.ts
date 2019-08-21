import Point from "../../../../rooms/map/coordinates/Point";

export default interface UserEventData {
	socketId: string,
	position: Point
}
