interface TileOffset {
	x: number,
	y: number
}

/*
 * Those tileOffsets are the x and y difference to get
 * the around tiles.
 */
const DIRECTION_OFFSETS: TileOffset[] = [
	{ // Direction = 0 = Directions.NORTH
		x: 0,
		y: -1
	},
	{ // Direction = 1 = Directions.NORTH_EAST
		x: 1,
		y: -1
	},
	{ // Direction = 2 = Directions.EAST
		x: 1,
		y: 0
	},
	{ // Direction = 3 = Directions.SOUTH_EAST
		x: 1,
		y: 1
	},
	{ // Direction = 4 = Directions.SOUTH
		x: 0,
		y: 1
	},
	{ // Direction = 5 = Directions.SOUTH_WEST
		x: -1,
		y: 1
	},
	{ // Direction = 6 = Directions.WEST
		x: -1,
		y: 0
	},
	{ // Direction = 7 = Directions.NORTH_WEST
		x: -1,
		y: -1
	},
]

export default DIRECTION_OFFSETS