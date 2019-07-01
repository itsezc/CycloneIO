import Room from '../rooms/room'

export default class WallItem /* extends RoomItem */
{
	private offset_x: number
	private offset_y: number
	
	// Global constants
	private comparableZ: number
	private priorityMultipler: number
	private priorityWallItem: number

	constructor(
		private readonly id: number, 
		private readonly x: number,
		private readonly y: number, 
		private readonly rotation: number,
		private readonly state: number,
		private readonly baseID: number,
		private readonly room: Room
	) {
		this.offset_x = -18
		this.offset_y = -25

		this.comparableZ = 10000
		this.priorityMultipler = 10000000
		this.priorityWallItem = 9

		const placeholder = new Phaser.GameObjects.Sprite(
			this.room,
			this.offset_x,
			this.offset_y,
			'wall_placeholder'
		)

		if(this.rotation == 4) {
			placeholder.scaleX = -1,
			placeholder.x = -this.offset_x
		}
	}

	calculateZIndex(id: number, x: number, y: number, zIndex: number, layerId: number): number {
		return(id * this.comparableZ) + layerId + (this.priorityMultipler * this.priorityWallItem)
	}

	// calculateZIndex(zIndex: number, layerIndex: number): number {
	// 	return calculateZIndexWallItem(this.id, this.x, this.y, zIndex, layerIndex)
	// }

	// getItemType(): ItemType {
	// 	return 'wallitem'
	// }
}