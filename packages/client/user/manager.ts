import User from './index'
import { default as Interfaces } from './interface'

interface UserDictionary {
	[id: number]: User
}

export default class Manager {

	users: UserDictionary
	currentUser?: User
	currencies: Interfaces.ICurrencies
	clubDays: number

	constructor() {
		this.users = {}
		this.clubDays = 72
	}

	getUser(id: number): User | null {
		return this.users[id]
	}

	setUser(
		options: User
	) : User {
		const { id, name, figure, motto } = options 

		const user: User = this.getUser(id)

		if (user === null) {
			this.users[id] = new User(id, name, figure, motto)
		} else {
			user.figure = figure
			user.motto = motto
			user.name = name
		}

		return this.users[id]
	}
	
	setCurrentUser(
		options: User
	): User {
		const { id, name, figure, motto } = options 

		this.currentUser = this.setUser({ id, name, figure, motto })
		return this.currentUser
	}

	updateCurrency(currency: string, balance: number) {
		if(this.currencies[currency] < 0) {
			// .. play currency Sound if it exists
		}

		this.currencies[currency] = balance 

		// .. update on UI
	}
}