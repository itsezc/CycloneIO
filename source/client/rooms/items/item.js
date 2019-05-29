// @flow

// User -> Goes to client -> loadUserItems() from DB -> ClientItems = [] 
// An Item exists in the inventory 
// A RoomItem exists in the Room
import Phaser, { Textures, GameObjects } from 'phaser'

const { Texture, Frame } = Textures
const { Group } = GameObjects

import type { Vector } from '../../../common/types/rooms/vector'

import Room from '../room'

import ItemPart from './item'

import Path from 'path'

import RoomItemPart from './part'

export default class RoomItem extends Group {

	+scene: Room
	+id: number
	texture: Texture
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

		super(scene, { classType: RoomItemPart })

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
		
		this.scene.load.setPath(Path.join('furniture', this.texture))
		this.scene.load.atlas({ key: this.texture, textureURL: this.texture.concat('.png'), atlasURL: this.texture.concat('.json') })
		this.scene.load.start()

		this.scene.load.once('complete', () => {
			this.create()
		})

	}

	create() {

		this.texture = this.scene.textures.get(this.texture)

		this.frames = this.texture.getFrameNames()
		
		this.frames.forEach(frame => {

			let parts = this.removeDuplicates(frame.split('_'))

			this.compose(frame, parts)

		})

	}

	compose(frame: Frame, parts: any[]): void {

		this.part = new RoomItemPart(this.scene, this.coordinates, frame, ...parts)
		this.part.create()

		this.add(this.part)

	}

	rotate(): void {
		//
	}

	move(): void {
		//
	}

	removeDuplicates<T>(collection: T[]): T[] {
 		return [...new Set(collection)]
	}
}