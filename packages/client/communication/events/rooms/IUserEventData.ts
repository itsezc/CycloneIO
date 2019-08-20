import IPoint from "../../../rooms/coordinates/IPoint";

export default interface IUserEventData {
	socketId: string,
	position: IPoint
}
