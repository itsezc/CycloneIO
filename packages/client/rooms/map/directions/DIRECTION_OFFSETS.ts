interface TileOffset {
	x: number,
	y: number
}

/*
 * Those tileOffsets are the x and y difference to get
 * the around tiles.
 */
const DIRECTION_OFFSETS: TileOffset[] = [
	{
		x: 0,
		y: -1
	},
	{
		x: 1,
		y: -1
	},
	{
		x: 1,
		y: 0
	},
	{
		x: 1,
		y: 1
	},
	{
		x: 0,
		y: 1
	},
	{
		x: -1,
		y: 1
	},
	{
		x: -1,
		y: 0
	},
	{
		x: -1,
		y: -1
	},
]

export default DIRECTION_OFFSETS