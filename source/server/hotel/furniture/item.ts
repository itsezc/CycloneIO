/**
 * Item class
 */
export default class Item {

	private id!: number
	private owner!: number
	private room!: number
	private x!: number
	private y!: number
	private z!: number
	private rotation!: number
	private inventory!: boolean
	private instance!: number // Instance or Calculate based on Max Furni possible (20) - All current items (10) : ORDER Timestamp created ([INDEX])
	
	//ltd
	/*
		20 Sofas (10 already bought)

		user 1: furni 9 (same furniture)
		user 2: furni 1, 2, 3, 4 (same furniture)
		user 3: furni 5, 7
		user 4: furni 6, 8, 10

		Instance in DB

		Max Furni (20) - Current Items (10)
		Get current Items (of Sofas) ORDER THEM by Timestamp of Creation
		[id] = Item Instance


		// furniture and items

		// Furniture = SOFA
		// ITEM = Instance of SOFA
		// furniture is in catalog
		// item is in room
		// User buys a Furniture = Item
		// Because a furniture has no placement (x, y, z), no owner (because its only a type)


	*/
}

/*

	Rooms[] => Room{1} 
	Items[Rooms{}[1]] = [
		{ id: 1, furniture: 1, x: 1, y: 1, z: 1 } //Static Normal Furni
		{ id: 2, furntirue: 2, type: 'wall', x: 1, y: 1 } //
	]

 */