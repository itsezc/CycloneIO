import RoomScene from './RoomScene'
import RoomData from './data/RoomData'
import RoomMap from './map/RoomMap'

import RoomContainer from './containers/RoomContainer'
import RoomAssetsManager from '../assets/rooms/RoomAssetsManager'
import IAssetsManager from '../assets/IAssetsManager'
import Habbo from "../Habbo";

export default class Room extends RoomScene {
	private readonly id: string

	private game: Habbo
	private roomContainer: RoomContainer
	private loader: IAssetsManager

	public roomData: RoomData
	public map: RoomMap

	public constructor(
		roomData: RoomData,
		game: Habbo
	) {
		super()

		this.game = game

		this.id = roomData.id
		this.roomData = roomData

		this.map = new RoomMap(this.roomData.map.room)

		this.loader = new RoomAssetsManager();
		this.loader.loadAssets()

		this.initializeContainers()

		this.centerCamera()
	}

	private initializeContainers(): void {
		this.roomContainer = new RoomContainer(this)

		this.addChild(this.roomContainer)
	}

	private centerCamera() {
		const doorTile = this.roomContainer.tilesContainer.getTileAt(0, 0)

		if (doorTile) {
			this.game.viewport.follow(doorTile, {
				speed: 0
			})
		}
	}
}
