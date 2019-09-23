import * as PIXI from 'pixi.js-legacy'

import RoomMap from './map/RoomMap'
import RoomData from './data/RoomData'

export default abstract class RoomScene extends PIXI.Container {
	public resources: Partial<Record<string, PIXI.LoaderResource>>

	public data: RoomData
	public map: RoomMap
}
