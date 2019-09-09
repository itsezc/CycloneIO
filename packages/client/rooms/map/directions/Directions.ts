enum Directions {
	NORTH,
	NORTH_EAST,
	EAST,
	SOUTH_EAST,
	SOUTH,
	SOUTH_WEST,
	WEST,
	NORTH_WEST
}

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace Directions {
	export function parse(direction: string): Directions {
		// @ts-ignore
		return Directions[direction];
	}

	export function forEach(callback: (direction: Directions, index: number) => void): void {
		const keys = Object.keys(Directions)

		for (let i = keys.length / 2; i < keys.length; i++) {
			callback(parse(keys[i]), i - keys.length / 2)
		}
	}
}

export default Directions