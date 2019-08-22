import IAssetsManager from "../IAssetsManager"
import Habbo from "../../Habbo";
import Logger from "../../logging/Logger";

export default class RoomAssetsManager extends Logger implements IAssetsManager {
    private readonly roomLoader: Phaser.Loader.LoaderPlugin

    public constructor(roomLoader: Phaser.Loader.LoaderPlugin) {
    	super('#004080', RoomAssetsManager.name)

        this.roomLoader = roomLoader
    }

    public loadAssets(): void {
		if (Habbo.DEBUG) {
			this.initConsoleOutput()
		}

		this.roomLoader.image('tile_hover', 'room/tile_hover.png')
    }

	private initConsoleOutput(): void {
		this.roomLoader.on('fileprogress', (file: Phaser.Loader.File) => {
			this.log(`Loading file => ${file.key} | Progress => ${Math.round(this.roomLoader.progress * 100)}%`)
		})

		this.roomLoader.on('complete', () => {
			this.log(`Loading files completed!`)
		})
	}
}
