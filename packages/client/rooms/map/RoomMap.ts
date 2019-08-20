import HeightMap, { HeightMapTile } from "./HeightMap";

export default class RoomMap {
	private rows: number
	private columns: number

	private heightMap: HeightMap

	public constructor(map: string[]) {
		this.generateMap(map)
	}

	public generateMap(map: string[]): void {
		this.rows = this.getRowLength(map)
		this.columns = this.getColumnLength(map)

		this.heightMap = this.getHeightMap(map)
	}

	private getRowLength(map: string[]): number {
		return map.length
	}

	private getColumnLength(map: string[]): number {
		const largestColumn =  map.reduce((a, b) => a.length > b.length ? a : b)

		return largestColumn.length
	}

	private getHeightMap(map: string[]): HeightMap {
		const tiles: HeightMapTile[] = []

		map.forEach((row, x) => {
			[...row].forEach((height, y) => {
				tiles.push({ x, y, height: this.getHeightByChar(height) })
			})
		})

		return { tiles }
	}

	private getHeightByChar(char: string): number {
		// Max of 30 height
		return '0123456789abcdefghijklmnopqrst'.indexOf(char)
	}

	public get tiles(): HeightMapTile[] {
		return this.heightMap.tiles
	}

	public set tiles(value: HeightMapTile[]) {
		this.heightMap.tiles = value
	}
}