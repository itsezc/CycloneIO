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
	 * This function converts a red integer, green integer and blue integer
	 * into a color integer.
	 *
	 * @param r The red component.
	 * @param g The green component.
	 * @param b The blue component.
	 * @returns number The color integer.
	 */
	public static RGBToInt(r: number, g: number, b: number): number {
		return (r << 16) + (g << 8) + (b);
	}

	/**
	 * This function converts a RGB components object into a color integer.
	 *
	 * @param components The RGB components
	 * @returns number The color integer.
	 */
	public static RGBToInt(components: RGB): number {
		return (components.R << 16) + (components.G << 8) + (components.B);
	}
}