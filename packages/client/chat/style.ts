export default class ChatStyle {
	
	constructor (
		public regPoints: RegPoints,
		public base: HTMLImageElement,
		public pointer: HTMLImageElement,
		public color: HTMLImageElement
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
	// pointer: boolean
}