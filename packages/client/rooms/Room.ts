import IRoom from "./IRoom"
import RoomData from "./data/RoomData"
import RoomMap from "./map/RoomMap"

import RoomContainer from "./containers/RoomContainer"

export default class Room extends IRoom {
	private readonly id: string
	private roomData: RoomData

	public map: RoomMap

	private roomContainer: RoomContainer

	public constructor(roomData: RoomData) {
		super({})

		this.id = roomData.id
		this.roomData = roomData

		this.map = new RoomMap(roomData.map.room)
	}

	private initializeContainers(): void {
		this.roomContainer = new RoomContainer(this)
		this.add.existing(this.roomContainer)
	}

	public create(): void {
		this.initializeContainers()

		console.log(this.roomData.map)
	}
}
