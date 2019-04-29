// @flow
export default class Room {
	id: number
	properties: Object

	constructor(id: number, properties: Object) {
		this.id = id
		this.properties = properties
	}
}
