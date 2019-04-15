import RoomModel from './model'

export default class Room {
	constructor(id, properties) {
		this.id = id
		this.properties = properties
	}

	static get depth(){
		return {
			TILE: 0,
			WALL: 1
		}
	}
}
