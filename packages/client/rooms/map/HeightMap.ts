export default interface HeightMap {
	tilePositions: HeightMapPosition[]
}

export interface HeightMapPosition {
	x: number,
	y: number,
	height: number
}