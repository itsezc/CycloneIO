import ITileGenerator from "./ITileGenerator";
import ITileGeneratorOptions from "./ITileGeneratorOptions";

import DataURL from "../../utils/DataURL";

import SVG from 'svg.js'

export default class TileGenerator implements ITileGenerator {
	private readonly spriteWidth: number
	private readonly spriteHeight: number
	private readonly viewBox: string
	private readonly rendering: string
	private result: SVG.Doc

	public constructor(options: ITileGeneratorOptions) {
		this.spriteWidth = options.sprite.width
		this.spriteHeight = options.sprite.height
		this.viewBox = options.sprite.viewBox || '0 -0.5 65 40'
		this.rendering = options.sprite.rendering || 'crispEdges'

		this.build()
	}

	/**
	 * This method builds the complete SVG object.
	 *
	 * @returns void
	 */
	private build(): void {
		this.result = this.createSVG()

		this.addPaths()
	}

	/**
	 * This method creates the SVG object
	 *
	 * @returns SVG.Doc The SVG object.
	 */
	private createSVG(): SVG.Doc {
		return SVG('app').attr({
			width: this.spriteWidth,
			height: this.spriteHeight,
			viewBox: this.viewBox,
			'shape-rendering': this.rendering,
			'xmlns:svgjs': null
		})
	}

	/**
	 * This method adds the paths to the SVG container.
	 *
	 * @returns void
	 */
	private addPaths(): void {
		// Top Left and Right Border
		this.result.path('M31 0h2M29 1h2M33 1h2M27 2h2M35 2h2M25 3h2M37 3h2M23 4h2M39 4h2M21 5h2M41 5h2M19 6h2M43 6h2M17 7h2M45 7h2M15 8h2M47 8h2M13 9h2M49 9h2M11 10h2M51 10h2M9 11h2M53 11h2M7 12h2M55 12h2M5 13h2M57 13h2M3 14h2M59 14h2M1 15h2M61 15h2M0 16h1M63 16h1').stroke('#8e8e5e')

		// Top Square
		this.result.path('M31 1h2M29 2h6M27 3h10M25 4h14M23 5h18M21 6h22M19 7h26M17 8h30M15 9h34M13 10h38M11 11h42M9 12h46M7 13h50M5 14h54M3 15h58M1 16h62M2 17h60M4 18h56M6 19h52M8 20h48M10 21h44M12 22h40M14 23h36M16 24h32M18 25h28M20 26h24M22 27h20M24 28h16M26 29h12M28 30h8M30 31h4').stroke('#989865')

		// Right Thickness Border
		this.result.path('M64 16h1M62 17h1M64 17h1M60 18h1M64 18h1M58 19h1M64 19h1M56 20h1M64 20h1M54 21h1M64 21h1M52 22h1M64 22h1M50 23h1M64 23h1M48 24h1M46 25h1M44 26h1M42 27h1M40 28h1M38 29h1M36 30h1M34 31h1M32 32h1M32 33h1M32 34h1M32 35h1M32 36h1M32 37h1M32 38h1M32 39h1').stroke('#676744')

		// Left Thickness Border
		this.result.path('M0 17h2M0 18h1M3 18h1M0 19h1M5 19h1M0 20h1M7 20h1M0 21h1M9 21h1M0 22h1M11 22h1M0 23h1M13 23h1M0 24h1M15 24h1M17 25h1M19 26h1M21 27h1M23 28h1M25 29h1M27 30h1M29 31h1M31 32h1').stroke('#7a7a51')

		// Right Thickness
		this.result.path('M63 17h1M61 18h3M59 19h5M57 20h7M55 21h9M53 22h11M51 23h13M49 24h15M47 25h15M45 26h15M43 27h15M41 28h15M39 29h15M37 30h15M35 31h15M33 32h15M33 33h13M33 34h11M33 35h9M33 36h7M33 37h5M33 38h3M33 39h1').stroke('#6f6f49')

		// Left Thickness
		this.result.path('M1 18h2M1 19h4M1 20h6M1 21h8M1 22h10M1 23h12M1 24h14M2 25h15M4 26h15M6 27h15M8 28h15M10 29h15M12 30h15M14 31h15M16 32h15M18 33h14M20 34h12M22 35h10M24 36h8M26 37h6M28 38h4M30 39h2').stroke('#838357')
	}

	/**
	 * This method converts the SVG XML tile into dataURL string.
	 *
	 * @returns string The dataURL encoded SVG.
	 */
	getDataURL(): string {
		return DataURL.svgToDataURL(this.result.svg())
	}
}