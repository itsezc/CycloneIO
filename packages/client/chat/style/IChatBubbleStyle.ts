import IChatBubbleProperties from "./IChatBubbleProperties";

export default interface IChatBubbleStyle {
	properties: IChatBubbleProperties,
	base: HTMLImageElement,
	pointer: HTMLImageElement,
	color: HTMLImageElement
}