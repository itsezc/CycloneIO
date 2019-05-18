//@flow
type Gender = 'M' | 'F'

export default class User {
	id: number
	username: string
	email: string
	motto: string
	figure: string
	rank: number
	vip: number
	gender: Gender
	home: number 
	volume: number
	verified: number
	appearOffline: boolean
	allowTrade: boolean
	allowGifts: boolean
	allowMimic: boolean
	allowFollow: boolean
	allowFriendRequests: boolean
	allowWhisper: boolean 
	allowBotSpeech: boolean
	allowPetSpeech: boolean	
}