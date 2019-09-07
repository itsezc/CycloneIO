export default class DataURL {
	/**
	 * This function converts SVG XML into a dataURL string.
	 *
	 * @param svg The SVG XML string.
	 * @returns string The dataURL string.
	 */
	public static svgToDataURL(svg: string): string {
		const encoded = encodeURIComponent(svg)
			.replace(/'/g, '%27')
			.replace(/"/g, '%22')

		const header = 'data:image/svg+xml,'

		return header + encoded
	}
}