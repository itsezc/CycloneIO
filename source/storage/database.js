import Logger from '../utils/logger'

import Config from '../../config.json'

import Users from './models/users'

import Orango from 'orango'
const { EVENTS, SCHEMA } = Orango.consts

import Joi from 'joi'
import Faker from 'faker'

class Database {
	constructor() {

		this.connection = Orango.get(Config.database.name)

		Logger.info('[🥑] Connecting to Database...')
		this.init()

		this.connection.events.once(EVENTS.CONNECTED, connection => {
			Logger.info('[🥑] Connected to Database')
		})

		this.connection.events.once(EVENTS.READY, () => {
			Logger.info('[🥑] Database is ready for connections')
		})
	}

	async init() {

		try {
			new Users(this.connection)
			// Users.insert({
			// 	email: 'chirub@foretag.co',
			// 	username: 'EZ-C',
			// 	password: 'password',
			// 	pin: '123456'
			// })
			await this.connection.connect({
				url: Config.database.host,
				username: Config.database.user,
				password: Config.database.pass
			})
		} catch (error) {
			Logger.error(error)
		}
	}

	clean() {

	}

}

export default Database
