import * as PIXI from 'pixi.js-legacy'
import {HeightMapPosition} from "../map/HeightMap";

export default class Wall extends PIXI.Sprite {
	public constructor(position: HeightMapPosition) {
		super(undefined)

		console.log(position)
	}
}