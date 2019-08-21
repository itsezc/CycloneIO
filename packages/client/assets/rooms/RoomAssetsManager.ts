import IAssetsManager from "../IAssetsManager"

export default class RoomAssetsManager implements IAssetsManager {

	private readonly roomLoader: Phaser.Loader.LoaderPlugin

	public constructor(roomLoader: Phaser.Loader.LoaderPlugin){
		this.roomLoader = roomLoader
	}

	public async loadAssets(): Promise<void> {
	    this.roomLoader.image('tile_hover', 'room/tile_hover.png')
	}
}
