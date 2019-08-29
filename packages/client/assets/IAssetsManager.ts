import * as PIXI from "pixi.js-legacy";

export default interface IAssetsManager {
	loadAssets(): Promise<Partial<Record<string, PIXI.LoaderResource>>>
}

