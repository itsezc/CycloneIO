/**
 * Furniture class
 */
export default class Furniture {
	
	private id: number
	private name: string
	private description: string
	private type: string
	private width: number
	private length: number
	private height: number
	private canStand: boolean
	private canStack: boolean
	private canWalk: boolean
	private canSit: boolean
	private buildersClub: boolean

	private spriteName: string

	// 15pillar.swf
	// Green Pillar () 

	/*
		"id": "3079",
		"classname": "ads_idol_clRack",
		"revision": "45508",
		"defaultdir": "0",
		"xdim": "3",
		"ydim": "1",
		"name": "Clothes Rack",
		"description": "Finally! Somewhere to hang up your clothes.",
		"offerid": "-1",
		"buyout": "0",
		"rentofferid": "-1",
		"rentbuyout": "0",
		"bc": "0",
		"excludeddynamic": "0",
		"specialtype": "1",
		"canstandon": "0",
		"cansiton": "0",
		"canlayon": "0",
		"furniline": "ad_sales"
	*/

	/**
	 * @param {number} id - The furniture ID
	 * @param {string} name - The furniture name
	 * @param {string} spriteName - The furniture file name
	 * @param {string} description - The furniture description
	 * @param {string} type - The furniture type
	 * @param {number} width - The furniture width
	 * @param {number} length - The furniture length
	 * @param {number} height - The furniture height
	 * @param {boolean} canStack - Sets whether the furniture can be stackable or not
	 * @param {boolean} canWalk - Sets whether the furniture can be stackable or not
	 * @param {boolean} canSit - Sets whether an entity can sit on the furniture or not
	 */
	public constructor(id: number, name: string, spriteName: string, description: string, type: string, width: number, length: number, height: number, canStack: boolean, canStand: boolean, canWalk: boolean, canSit: boolean, buildersClub: boolean) {
		this.id = id
		this.name = name
		this.spriteName = spriteName
		this.description = description
		this.type = type
		this.width = width
		this.length = length
		this.height = height
		this.canStand = canStand
		this.canStack = canStack
		this.canWalk = canWalk
		this.canSit = canSit
	}
}