import IRoom from "./IRoom"
import RoomData from "./data/RoomData"
import RoomMap from "./map/RoomMap"

import RoomContainer from "./containers/RoomContainer"
import RoomAssetsManager from "../assets/rooms/RoomAssetsManager";
import IAssetsManager from "../assets/IAssetsManager";

export default class Room extends IRoom {
	private readonly id: string

	public load: IAssetsManager

	public roomData: RoomData
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

	public preload(): void {
		this.load = new RoomAssetsManager(this);

		this.load.assets()
	}

	public create(): void {
		this.initializeContainers()

		console.log(this.roomData.map)
	}
}
