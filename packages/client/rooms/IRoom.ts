import * as Phaser from 'phaser'

import RoomMap from "./map/RoomMap";

export default abstract class IRoom extends Phaser.Scene {
	public map: RoomMap
}
