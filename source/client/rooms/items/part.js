// @flow

import Phaser, { Textures } from 'phaser'

const { Texture, Frame } = Textures

import GameSprite from '../../games/sprite'

import Room from '../room'

import type { Vector } from '../../../common/types/rooms/vector'

import RoomModelDepth from '../../../common/enums/rooms/models/depth'

export default class RoomItemPart extends GameSprite {
	
	+scene: Room
	+coordinates: Vector
	+frame: Frame
	+part: number
	+texture: Texture
	+resolution: number
	+chronological: string
	+rot: number
	+state: number

	constructor(scene: Room, coordinates: Vector, frame: Frame, part: string, texture: Texture, resolution: string, chronological: string, rot: string, state: string) {
		
		super(scene, coordinates, RoomModelDepth.ITEM, texture, frame)
		
		this.scene = scene
		this.coordinates = coordinates
		this.frame = frame
		this.part = Number(part)
		this.texture = texture
		this.resolution = Number(resolution)
		this.chronological = chronological
		this.rot = Number(rot)
		this.state = Number(state !== undefined ? state.replace('.png', '') : state)

	}

	create() {
		super.create()

		this.setPosition(this.isometricCoords.x - 1, this.isometricCoords.y - 10)
	}
}