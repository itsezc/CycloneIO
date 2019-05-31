
/**
 * RoomEntity class
 */
export default class RoomEntity {

	public id: number
	public x: number
	public y: number

	/**
	 * @param {number} id - The entity ID
	 * @param {number} x - The x position of the entity
	 * @param {number} y - The y position of the entity
	 */
	public constructor(id: number, x: number, y: number) {
		this.id = id
		this.x = x
		this.y = y
	}
}
