import RoomScene from './RoomScene'
import RoomData from './data/RoomData'
import RoomMap from './map/RoomMap'

import RoomContainer from './containers/RoomContainer'
import RoomAssetsManager from '../assets/rooms/RoomAssetsManager'
import IAssetsManager from '../assets/IAssetsManager'
import CameraManager from './camera/CameraManager'
import IInputManager from "../input/IInputManager";
import RoomInputManager from "./input/RoomInputManager";
import RoomCameraManager from "./camera/CameraManager";
import Habbo from "../Habbo";

export default class Room extends RoomScene {
	private readonly id: string

	private roomContainer: RoomContainer
	private inputManager: IInputManager
	private loader: IAssetsManager

	public roomData: RoomData
	public map: RoomMap

	public roomCameraManager: RoomCameraManager

	public constructor(roomData: RoomData) {
		super({})

		this.id = roomData.id
		this.roomData = roomData

		this.map = new RoomMap(this.roomData.map.room)
	}

	private initializeContainers(): void {
		this.roomContainer = new RoomContainer(this)
		this.add.existing(this.roomContainer)
	}

	public preload(): void {
		this.loader = new RoomAssetsManager(this.load);
		this.loader.loadAssets()
	}

	public update(time: number, delta: number): void {
		this.updateFPSCounter()
	}

	public create(): void {
		this.initializeContainers()
		this.initializeManagers()

		this.centerCamera()
	}

	private initializeManagers(): void {
		this.roomCameraManager = new RoomCameraManager(this.cameras.main)
		this.inputManager = new RoomInputManager(this)

		this.inputManager.registerInputEvents()
	}

	private centerCamera() {
		const doorTile = this.roomContainer.tilesContainer.getTileAt(0, 0)

		if (doorTile) {
			this.roomCameraManager.centerCamera(doorTile.x, doorTile.y)
		}
	}

	private updateFPSCounter() {
		if (Habbo.DEBUG) {
			this.roomContainer.debugContainer.setFPS(this.game.loop.actualFps)
		}
	}
}
