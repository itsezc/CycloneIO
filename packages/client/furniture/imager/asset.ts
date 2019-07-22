export default class FurniAsset {

	constructor(
		public image: HTMLImageElement,
		public x: number,
		public y: number,
		public isFlipped: boolean
	) {}
}

export interface FurniAssetDictionary {
	[id: string]: FurniAsset 
}
