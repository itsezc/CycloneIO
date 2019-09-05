export default interface HeightMap {
	tilePositions: HeightMapPosition[],

	// This properties represent the maximum position on
	// X and Y axis while their opposite axis is 0
	maxInXAxis: HeightMapPosition,
	maxInYAxis: HeightMapPosition
}

export interface HeightMapPosition {
	x: number,
	y: number,
	height: number
}