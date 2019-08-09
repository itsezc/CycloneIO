export default class ChatStyle {
	constructor(
		public base: HTMLImageElement,
		public pointer: HTMLImageElement,
		public color: HTMLImageElement,
		public regPoints: RegPoints
	) {}
}

export interface RegPoints {
	sliceXY: number[],
    sliceWH: number[],
    colorXY: number[],
    pointerY: number,
    faceXY: number[],
    textFieldMargins: number[],
    textColorRGB: number,
    fontFace: string,
    fontSize: number,
    overlapRect: number[],
}