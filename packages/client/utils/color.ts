export interface RGB {
	R: number
	G: number
	B: number
}

export default class Color {
	/**
	 * This function converts a color integer into a RGB object.
	 *
	 * @param int The integer you want to convert.
	 * @returns RGB The components.
	 */
	public static intToRGB(int: number): RGB {
		return {
			R: ((int >> 16) & 0xff),
			G: ((int >> 8) & 0xff),
			B: ((int) & 0xff)
		}
	}

	/**
	 * This function converts a RGB components object into a color integer.
	 *
	 * @param components The RGB components
	 * @returns number The color integer.
	 */
	public static rgbToInt(components: RGB): number {
		return (components.R << 16) + (components.G << 8) + (components.B);
	}
}