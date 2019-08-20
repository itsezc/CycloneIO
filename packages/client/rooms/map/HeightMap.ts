export default interface HeightMap {
	tiles: HeightMapTile[]
}

export interface HeightMapTile {
	x: number,
	y: number,
	height: number
}