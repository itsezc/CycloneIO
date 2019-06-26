// @flow

// User -> Goes to client -> loadUserItems() from DB -> ClientItems = [] 
// An Item exists in the inventory 
/* // A RoomItem exists in the Room

import Phaser from 'phaser'
import Vector from '../../../common/types/rooms/vector'

import Room from '../room'

import ItemPart from './item'

import Path from 'path'

import RoomItemPart from './part'

export default class RoomItem extends Phaser.GameObjects.Group {

	public scene: Room
	private textureName: string
	private id: number
	private owner: number
	private room: number
	private coordinates: Vector
	private rotation: number
	private state: number
	// +wallPosition: number

	private part!: RoomItemPart

	private texture!: Phaser.Textures.Texture

	//+instance: number
	//+inventory: boolean 

	//+furniture: Furniture

	constructor(scene: Room, textureName: string, id: number, owner: number, room: number, coordinates: Vector, rotation: number, state: number wallPosition: number) {

		super(scene)

		this.scene = scene
		this.textureName = textureName
		this.id = id
		this.owner = owner
		this.room = room
		this.coordinates = coordinates
		this.rotation = rotation
		this.state = state
		// this.wallPosition = wallPosition

		//this.furniture = Furniture.load(furniture)
	}

	load() {
		
		this.scene.load.setPath(Path.join('furniture', this.textureName))
		this.scene.load.atlas({ key: this.textureName, textureURL: this.textureName.concat('.png'), atlasURL: this.textureName.concat('.json') })
		this.scene.load.start()

		this.scene.load.once('complete', () => {
			this.create()
		})

	}

	create() {
		
		this.texture = this.scene.textures.get(this.textureName)

		const frames: string[] = this.texture.getFrameNames()

		frames.forEach(frame => {

			let parts = this.removeDuplicates<string>(frame.split('_'))
			this.compose(frame, parts)

		})

	}

	compose(frame: string, parts: string[]): void {
		//'1_throne_64_a_2_0'

		this.part = new RoomItemPart(this.scene, this.coordinates, frame, parts[0], parts[1], parts[2], parts[3], parts[4], parts[5])
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
} */