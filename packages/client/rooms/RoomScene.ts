import * as PIXI from 'pixi.js'

import RoomMap from "./map/RoomMap";
import RoomData from "./data/RoomData";

export default abstract class RoomScene extends PIXI.Container {
	public roomData: RoomData
	public map: RoomMap
}
