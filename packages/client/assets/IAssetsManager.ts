import * as Phaser from 'phaser'

export default abstract class IAssetsManager extends Phaser.Loader.LoaderPlugin {
	public abstract assets(): void
}

