import Room from '../rooms/Room'

import ChatImager from '../chat/'
import SoundManager from '../sound/manager'


export default class Engine {

	currentRoom?: Room
	
	chatImager: ChatImager
	soundManager: SoundManager
	
	constructor() {

		this.chatImager = new ChatImager()

	}

}
