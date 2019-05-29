// @flow 

export const FurnitureTypeEnum = {
	FLOOR: 0,
	WALL: 1,
	EFFECT: 2,
}

export type FurnitureType = $Values<typeof FurnitureTypeEnum>