// @flow
export default class Room {
	id: number
	map: Array<number[]>
	properties: Object

	constructor(id: number, map: Array<number[]>, properties: Object) {
		this.id = id
		this.map = map
		this.properties = properties
	}
}
