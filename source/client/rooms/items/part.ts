/* import Phaser, { Textures } from 'phaser'

const { Texture, Frame } = Textures

import GameSprite from '../../games/sprite'

import Room from '../room'

import Vector from '../../../common/types/rooms/vector'
import RoomObjectDepth from '../../../common/enums/rooms/objects/depth'

export default class RoomItemPart extends GameSprite {
	
	private readonly _part: number
	private readonly _resolution: number
	private readonly _chronological: string
	private readonly _rot: number
	private readonly _state: number

	constructor(scene: Room, coordinates: Vector, frame: string, part: string, textureName: string, resolution: string,
		chronological: string, rot: string, state: string) 
	{
		super(scene, coordinates, RoomObjectDepth.ITEM, textureName, frame)
		
		this._part = Number(part)
		this._resolution = Number(resolution)
		this._chronological = chronological
		this._rot = Number(rot)
		this._state = Number(state !== undefined ? state.replace('.png', '') : state)
	}

	public create(): void {

		super.create()
		this.setPosition(this.isometricCoords.x - 1, this.isometricCoords.y - 10)
	}
} */