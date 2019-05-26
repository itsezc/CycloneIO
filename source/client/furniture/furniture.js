// @flow

type FurnitureType = 'floor' | 'wall'

export default class Furniture {
	
	+id: number
	+spriteName: string
    +name: string
    +description: string
    +type: FurnitureType
    +width: number
    +length: number
    +height: number
    +canStand: boolean
    +canStack: boolean
    +canWalk: boolean
    +canSit: boolean
	
	/**
     * @param {number} id - The furniture ID
	 * @param {string} spriteName - The furniture file name
     * @param {string} name - The furniture name
     * @param {string} description - The furniture description
     * @param {string} type - The furniture type
     * @param {number} width - The furniture width
     * @param {number} length - The furniture length
     * @param {number} height - The furniture height
     * @param {boolean} canStack - Sets whether the furniture can be stackable or not
     * @param {boolean} canWalk - Sets whether the furniture can be stackable or not
     * @param {boolean} canSit - Sets whether an entity can sit on the furniture or not
     */
	constructor(id: number, spriteName: string, name: string, description: string, type: FurnitureType, width: number, length: number, height: number, canStand: boolean, canStack: boolean, canSit: boolean) {

	}
}