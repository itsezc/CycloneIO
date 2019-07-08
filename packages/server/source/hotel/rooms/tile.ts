import Vector from "packages/common/types/rooms/vector";

export enum State {
	OPEN,
	BLOCKED,
	INVALID,
	SIT,
	LAY
}

export default class RoomTile {

	public constructor(private readonly coordinates: Vector, private state: State) {
		this.coordinates = coordinates
		this.state = state
	}

	public get State(): State {
		return this.state
	}

	public set State(state: State) {
		this.state = state
	}

	public get isWalkable(): boolean {
		return this.state === State.OPEN
	}
}