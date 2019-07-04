import BadgePart from './parts/part'
import { LinkedList } from 'typescript-collections'

export default class GuildBadge {

	public constructor(private base: BadgePart, private readonly symbols: LinkedList<BadgePart>,
					   private readonly colors: LinkedList<number>, private readonly points: LinkedList<number>) {
		this.base = base
		this.symbols = symbols
		this.colors = colors
		this.points = points
	}

	public get Base(): BadgePart {
		return this.base
	}

	public setBase(base: BadgePart, color: number, point: number): void {
		this.base = base
		this.colors.add(color, 0)
		this.points.add(point, 0)
	}

	public addBase(symbol: BadgePart, color: number, point: number): void {
		if (!this.base) {
			throw new Error('Base has not been assigned yet!')
		}

		this.symbols.add(symbol)
		this.colors.add(color)
		this.points.add(point)
	}

	public static calculateDrawingPoint(canvasSize: number[], symbolSize: number[], position: number): number[] {
		var out = [0, 0]

		switch (position) {
			case 1:
				out[0] = (canvasSize[0] - symbolSize[1]) / 2
				out[1] = 0
				break

			case 2:
				out[0] = canvasSize[0] - symbolSize[1]
				out[1] = 0
				break

			case 3:
				out[0] = 0
				out[1] = (canvasSize[1] / 2) - (symbolSize[0] / 2)
				break

			case 4:
				out[0] = (canvasSize[0] / 2) - (symbolSize[1] / 2)
				out[1] = (canvasSize[1] / 2) - (symbolSize[0] / 2)
				break

			case 5:
				out[0] = canvasSize[0] - symbolSize[1]
				out[1] = (canvasSize[1] / 2) - (symbolSize[0] / 2)
				break

			case 6:
				out[0] = 0
				out[1] = canvasSize[1] - symbolSize[0]
				break

			case 7:
				out[0] = ((canvasSize[0] - symbolSize[1]) / 2)
				out[1] = canvasSize[1] - symbolSize[0]
				break

			case 8:
				out[0] = canvasSize[0] - symbolSize[1]
				out[1] = canvasSize[1] - symbolSize[0]
				break
		}

		return out
	}
}