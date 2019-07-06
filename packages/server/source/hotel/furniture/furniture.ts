export enum Type {
	FLOOR,
	WALL,
	EFFECT
}

export default class Furniture {

	constructor(private readonly id: number, private readonly name: string, private readonly type: Type,
				private readonly width: number, private readonly length: number, private readonly stackHeight: number,
				private readonly stackable: boolean, private readonly sittable: boolean, private readonly walkable: boolean,
				private readonly recyclable: boolean, private readonly tradable: boolean) {

	}
}