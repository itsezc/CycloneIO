export default interface ITileGenerator {
	/**
	 * This method converts the SVG XML tile into dataURL string.
	 *
	 * @returns string The dataURL encoded SVG.
	 */
	getDataURL(): string;
}