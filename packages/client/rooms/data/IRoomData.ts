import IRoomMap from "../map/IRoomMap";

export default interface RoomData {
	allowPets: boolean
	allowPetsEating: boolean
	category: null | string
	currentUsers: number
	description: null | string
	floorThickness: number
	hideWalls: boolean
	hideWired: boolean
	id: string
	map: IRoomMap
	maxUsers: number
	name: string
	type: string
	wallHeight: number
	wallThickness: number
}
