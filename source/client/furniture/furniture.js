// @flow

import type { FurnitureType } from '../../common/enums/furniture/type'
import { FurnitureTypeEnum } from '../../common/enums/furniture/type'

export default class Furniture {
	
        +id: number // (Furniture Number)
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
         * @param {FurnitureType} type - The furniture type
         * @param {number} width - The furniture width
         * @param {number} length - The furniture length
         * @param {number} height - The furniture height
         * @param {boolean} canStack - Sets whether the furniture can be stackable or not
         * @param {boolean} canWalk - Sets whether the furniture can be walkable or not
         * @param {boolean} canSit - Sets whether an entity can sit on the furniture or not
         */
        constructor(id: number, spriteName: string, name: string, description: string, type: FurnitureType, width: number, length: number, height: number, canStand: boolean, canStack: boolean, canWalk: boolean, canSit: boolean) {
                this.id = id
                this.spriteName = spriteName
                this.name = name
                this.description = description
                this.type = type
                this.width = width
                this.length = length
                this.height = height
                this.canStack = canStack
                this.canWalk = canWalk
                this.canSit = canSit
	}

	// User goes into the room -> RoomID -> DB / Server -> Client Furniture[] -> forEach Furniture => Furni (where Furniture class is initiated) -> Item (getFurniture(basedOnId)) 
	static load(id: number): Furniture {
                return new Furniture(0, "throne", "name", "desc", FurnitureTypeEnum.FLOOR, 0, 0, 0, false, true, false, false)
	}
}