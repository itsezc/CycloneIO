import SocketIO from 'socket.io'

enum Gender {
	M, F
}

export default class Player {
	constructor(
		private readonly socket: SocketIO.Socket,

		private readonly id: number, private readonly email: string, 
		private readonly motto: string, private readonly figure: string, private readonly rank: number, 
		private readonly vip: number, private readonly gender: Gender, private readonly home: number, 
		private readonly volume: number, private readonly verified: number, private readonly appearOffline: boolean, 
		private readonly allowTrade: boolean, private readonly allowGifts: boolean, private readonly allowFollow: boolean, 
		private readonly allowFriendRequests: boolean, private readonly allowWhisper: boolean, private readonly allowBotSpeech: boolean, 
		private readonly allowPetSpeech: boolean
	) {
		this.socket = socket
		
		this.id = id
		this.email = email
		this.motto = motto
		this.figure = figure
		this.rank = rank
		this.vip = vip
		this.gender = gender
		this.home = home
		this.volume = volume
		this.verified = verified
		this.appearOffline = appearOffline
		this.allowGifts = allowGifts
		this.allowFollow = allowFollow
		this.allowWhisper = allowWhisper
		this.allowBotSpeech = allowBotSpeech
		this.allowPetSpeech = allowPetSpeech
	}

	disconnect() {

	}
}