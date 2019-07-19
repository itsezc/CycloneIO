export default interface RoomModelEntity {
	id: number,
	name: string,
	doorX: number,
	doorY: number,
	doorDirection: any,
	model: Array<Array<number>>
}