// @flow

/**
 * RoomEntity class
 */
export default class RoomEntity {
	id: number
	x: number
	y: number

	/**
	 * @param {number} id - The entity ID
	 * @param {number} x - The x position of the entity
	 * @param {number} y - The y position of the entity
	 */
	constructor(id: number, x: number, y: number) {
		this.id = id
		this.x = x
		this.y = y
	}
}
