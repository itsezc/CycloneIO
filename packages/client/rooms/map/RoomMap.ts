import HeightMap, { HeightMapPosition } from './HeightMap'
import DIRECTION_OFFSETS from './directions/DIRECTION_OFFSETS'
import Directions from './directions/Directions'

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
		const largestColumn = map.reduce((a, b): string => a.length > b.length ? a : b)

		return largestColumn.length
	}

	private getMaxAxisPositionsFromTiles(tiles: HeightMapPosition[]): { x: HeightMapPosition, y: HeightMapPosition } {
		const maxInXAxis = tiles
			.filter((p): boolean => p.y === 0)
			.reduce((prev, curr): HeightMapPosition => (prev.x > curr.x) ? prev : curr)
		const maxInYAxis = tiles
			.filter((p): boolean => p.x === 0)
			.reduce((prev, curr): HeightMapPosition => (prev.y > curr.y) ? prev : curr)

		return { x: maxInXAxis, y: maxInYAxis }
	}

	private getHeightMap(map: string[]): HeightMap {
		const tiles: HeightMapPosition[] = []

		// The row is the Y point cause the drawing starts from the
		// top corner instead of the bottom one.
		map.forEach((row, y): void => {
			[...row].forEach((height, x): void => {
				const intHeight = this.getHeightByChar(height)

				if (intHeight !== -1) {
					tiles.push({ x, y, height: this.getHeightByChar(height) })
				}
			})
		})

		const maxInAxis = this.getMaxAxisPositionsFromTiles(tiles)

		return {
			tilePositions: tiles,
			maxInXAxis: maxInAxis.x,
			maxInYAxis: maxInAxis.y
		}
	}

	private getHeightByChar(char: string): number {
		// Max of 30 height
		return '0123456789abcdefghijklmnopqrst'.indexOf(char)
	}

	public getTilePositionAt(x: number, y: number): HeightMapPosition | undefined {
		return this.heightMap.tilePositions.find((t): boolean => t.x === x && t.y === y)
	}

	public getTilePositionsAround(x: number, y: number): HeightMapPosition[] {
		const tilePositions: HeightMapPosition[] = []
		const tilePosition = this.getTilePositionAt(x, y)

		if (!tilePosition) return []

		for (const directionOffset of DIRECTION_OFFSETS) {
			const tileAround = this.getTilePositionAt(x + directionOffset.x, y + directionOffset.y)

			tilePositions.push(tileAround)
		}

		return tilePositions
	}

	public getWallPositions(): HeightMapPosition[] {
		return this.tilePositions.filter((p): boolean => this.isValidWallPosition(p))
	}

	public getStairPositions(): HeightMapPosition[] {
		return this.tilePositions.filter((p): boolean => this.isValidStairPosition(p))
	}

	public isValidWallPosition(position: HeightMapPosition): boolean {
		return position.x <= this.maxInXAxis.x && !this.getTilePositionAt(position.x, position.y - 1)
			|| position.y <= this.maxInYAxis.y && !this.getTilePositionAt(position.x - 1, position.y)
	}

	public isValidStairPosition(position: HeightMapPosition): boolean {
		const tilesAround = this.getTilePositionsAround(position.x, position.y)

		return tilesAround.some(tileAround => { return tileAround && tileAround.height === position.height + 1 })
	}

	private get maxInXAxis(): HeightMapPosition {
		return this.heightMap.maxInXAxis
	}

	private get maxInYAxis(): HeightMapPosition {
		return this.heightMap.maxInYAxis
	}

	public get tilePositions(): HeightMapPosition[] {
		return this.heightMap.tilePositions
	}
}