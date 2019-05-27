// @flow

const RoomModelDepth = {
	WALL: 0,
	DOOR: 1,
	TILE: 2,
	TILE_HOVER: 3,
	ITEM: 4,
	PET: 5,
	FIGURE: 6
}
	
export type Depth = $Values<typeof RoomModelDepth>

export default RoomModelDepth