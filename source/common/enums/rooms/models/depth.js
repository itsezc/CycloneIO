// @flow
const depth = {
	WALL: 0,
	DOOR: 1,
	TILE: 2,
	TILE_HOVER: 3,
	ITEM: 4,
	PET: 5,
	FIGURE: 6
}
  
export type RoomModelDepth = $Keys<typeof depth>