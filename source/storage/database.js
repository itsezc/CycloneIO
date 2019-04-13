import Logger from '../utils/logger'

import Config from '../../config.json'

import Users from './models/users'

import Orango from 'orango'
const {
	EVENTS,
	SCHEMA
} = Orango.consts

import Joi from 'joi'
import Faker from 'faker'

export default class Database {
	constructor() {
		this.connection = Orango.get(Config.database.name)

		Logger.database('Connecting to Database...')

		this.init()

		this.connection.events.once(EVENTS.CONNECTED, connection => {
			Logger.database('Connected to Database')
		})

		this.connection.events.once(EVENTS.READY, () => {
			Logger.database('Database is ready for connections')
		})

		return this.connection
	}

	async init() {
		try {
			let User = new Users(this.connection)
			User.insert({
				email: 'chirub@foretag.co',
				username: 'EZ-C',
				password: 'password',
				pin: '123456'
			})

			await this.connection.connect({
				url: Config.database.host,
				username: Config.database.user,
				password: Config.database.pass
			})

			this.healthCheck()
		} catch (error) {
			Logger.error(error)
		}
	}

	async healthCheck() {
		this.connection.checkConnected()
	}
}
