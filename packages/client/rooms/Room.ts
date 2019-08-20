import * as Phaser from 'phaser'
import IRoom from "./IRoom"
import RoomData from "./data/RoomData";
import RoomMap from "./map/RoomMap";

export default class Room extends IRoom {
	private readonly id: string
	private roomData: RoomData
	private map: RoomMap

	public constructor(roomData: RoomData) {
		super({})

		this.id = roomData.id
		this.roomData = roomData

		this.map = new RoomMap(roomData.map.room)
	}

	public create(): void {
		console.log(this.map.tiles)
	}
}
