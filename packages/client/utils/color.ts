interface RGB {
	R: number
	G: number
	B: number
}

const integerToRGB = (color: number) => {
	return {
		R: ((color >> 16) & 0xff),
		G: ((color >> 8) & 0xff),
		B: ((color) & 0xff)
	}
}

export {
	RGB,
	integerToRGB
}