import * as PIXI from 'pixi.js-legacy'
import {HeightMapPosition} from "../map/HeightMap";

export default class Wall extends PIXI.Sprite {
	public static readonly HEIGHT = 20
	public static readonly WIDTH = 40

	public static readonly HEIGHT_VALUE = 120

	public constructor(position: HeightMapPosition) {
		super(undefined)

		console.log(position)
	}
}