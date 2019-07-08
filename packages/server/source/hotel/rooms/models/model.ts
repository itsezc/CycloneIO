import Vector, { Vector2D } from "packages/common/types/rooms/vector"

import RoomTile, { State } from "../tile";

export enum Type {
	DYNAMIC,
	STATIC
}

export default class RoomModel {

	private mapSize: Vector2D

	private tiles: RoomTile[][]
	private door: RoomTile

	constructor(private readonly id: number, private readonly map: number[][], private readonly type: Type,

				private readonly doorCoordinates: Vector, private readonly doorRotation: number) {

		this.id = id
		this.map = map
		this.type = type

		this.doorCoordinates = doorCoordinates
		this.doorRotation = doorRotation

		this.create()
	}

	public get Id(): number {
		return this.id
	}

	private create() {
		this.mapSize = { x: this.map[0].length, y: this.map.length }

		for (let y = 0; y < this.mapSize.x; y++) {

			for (let x = 0; x < this.mapSize.x; x++) {
				var square = this.map[x][y]
				var state = square > 0 ? State.OPEN : State.INVALID

				this.tiles[x][y] = new RoomTile({ x, y, z: 0 }, state)
			}
		}

		this.door = this.tiles[this.doorCoordinates.x][this.doorCoordinates.y]
	}
}