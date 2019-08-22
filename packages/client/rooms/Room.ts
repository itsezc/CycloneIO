import RoomScene from "./RoomScene"
import RoomData from "./data/RoomData"
import RoomMap from "./map/RoomMap"

import RoomContainer from "./containers/RoomContainer"
import RoomAssetsManager from "../assets/rooms/RoomAssetsManager";
import IAssetsManager from "../assets/IAssetsManager";

export default class Room extends RoomScene {
	private readonly id: string

	public roomData: RoomData
	public map: RoomMap

	private roomContainer: RoomContainer
	private loader: IAssetsManager

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

	public async preload(): Promise<void> {
		this.loader = new RoomAssetsManager(this.load);
		this.loader.loadAssets()
	}

	public create(): void {
		this.initializeContainers()
	}
}
