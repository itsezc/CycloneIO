import * as PIXI from 'pixi.js-legacy'

import IAssetsManager from "../IAssetsManager"
import Logger from "../../logging/Logger";

export default class RoomAssetsManager extends Logger implements IAssetsManager {
    private readonly roomLoader: PIXI.Loader

    public constructor() {
    	super('#004080', RoomAssetsManager.name)

        this.roomLoader = PIXI.Loader.shared
    }

    public loadAssets(): Promise<Partial<Record<string, PIXI.LoaderResource>>> {
		this.initConsoleOutput()

		return new Promise(resolve => {
			this.roomLoader.add('tile_hover', 'room/tile_hover.png')
				.load((loader, resources) => resolve(resources))
		})
    }

	private initConsoleOutput(): void {
    	this.roomLoader.on('progress', (loader: PIXI.Loader, file: PIXI.LoaderResource) => {
			this.debug(`Loading file => ${file.name} | Progress => ${Math.round(loader.progress)}%`)
		})

		this.roomLoader.on('complete', () => {
			this.debug(`Loading files completed!`)
		})
	}
}
