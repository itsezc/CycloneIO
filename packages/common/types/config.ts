export type CycloneConfig = {
	version: string
	license: string
	mode: string
	hotel: Hotel
	server: Server
	database: Database
}

export type Database = {
	type: string
	host: string
	port: number
	name: string
	user: string
	pass: string
}

export type Hotel = {
	name: string
	theme: string
	maintenance: boolean
	currencies: string[]
	url: string[]
	user: User
	registration: Registration
}

export type Registration = {
	rank: number
	room: number
	vip: number
	motto: string
	currencies: Currency[]
}

export type Currency = {
	name: string
	amount: number
}

export type User = {
	maxFriends: number
	maxClubFriends: number
}

export type Server = {
	host: string
	port: number
}


export default CycloneConfig
