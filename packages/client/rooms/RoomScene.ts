import * as Phaser from 'phaser'

import RoomMap from "./map/RoomMap";
import RoomData from "./data/RoomData";
import RoomCameraManager from "./camera/CameraManager";

export default abstract class RoomScene extends Phaser.Scene {
	public roomData: RoomData
	public map: RoomMap

	public roomCameraManager: RoomCameraManager
}
