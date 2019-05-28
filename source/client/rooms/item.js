// @flow

// User -> Goes to client -> loadUserItems() from DB -> ClientItems = [] 
// An Item exists in the inventory 
// A RoomItem exists in the Room
import Phaser, { Textures } from 'phaser'

const { Texture } = Textures

//import Furniture from '../../furniture/furniture'

import GameSprite from '../games/sprite'
import Room from './room'

import type { Vector } from '../../common/types/rooms/vector'

import RoomModelDepth from '../../common/enums/rooms/models/depth'

export default class RoomItem extends GameSprite {

	+scene: Room
	+id: number
	+texture: Texture
	+owner: number
	+room: number
	+coordinates: Vector
	+rotation: number
	+state: number
	// +wallPosition: number

	//+instance: number
	//+inventory: boolean 

	//+furniture: Furniture

	constructor(scene: Room, id: number, texture: Texture, owner: number, room: number, coordinates: Vector, rotation: number, state: number /* wallPosition: number */) {

		super(scene, coordinates, texture, RoomModelDepth.ITEM)

		this.scene = scene
		this.id = id
		this.texture = texture
		this.owner = owner
		this.room = room
		this.coordinates = coordinates
		this.rotation = rotation
		this.state = state
		// this.wallPosition = wallPosition

		//this.furniture = Furniture.load(furniture)
	}

	load() {
		super.load('furniture')

		this.scene.load.once('complete', () => {
			this.create()
		})
	}

	create() {
		super.create()

		this.frames = this.texture.getFrameNames()
		
		this.frames.forEach(frame => {

			let parts = frame.split('_')

			this.compose(frame, parts)

		})

		this.setFrame(this.defaultFrame)

		this.setPosition(this.isometric.x - 1, this.isometric.y - 36)

	}

	compose(frame: string, parts: any[]): void {
		
		var resolution = parts[3]
		var chronological = parts[4]
		var rotation = parts[5] || '0'
		var state = parts[6] || '0'

		if (state.includes('.png')) {
			state = state.replace('.png', '')
		}

		if (resolution == 64 && chronological === 'a' && rotation == 2 && state == 0) {
			this.defaultFrame = frame
		}
	}

	rotate(): void {
		//
	}

	move(): void {
		//
	}
}