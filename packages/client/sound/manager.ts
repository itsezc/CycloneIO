import {
	SOUND_CREDITS,
	SOUND_PIXELS,
	SOUND_CHAT_CONSOLE_SENT,
	SOUND_CHAT_CONSOLE_RECIEVE
} from './index'

export default class Manager extends Phaser.Sound.BaseSoundManager {

	sample: Phaser.Sound.BaseSound

	constructor(
		game: Phaser.Game,
		sample: string
	) {		
		super(game)
		this.sample = this.add(sample)
	}

}