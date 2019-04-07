import Logger from '../utils/logger'

import Config from '../../config.json'

import Orango from 'orango'
const { EVENTS } = Orango.consts

class Database {
	constructor() {
		this.connection = Orango.get(Config.database.name)

		Logger.info('Connecting to DB...')
		this.init()

		this.connection.events.once(EVENTS.CONNECTED, connection => {
			Logger.info('🥑  Connected to ArangoDB')
		})

		this.connection.events.once(EVENTS.READY, () => {
			Logger.info('🍊  Orango is ready!')
		})
	}

	async init() {
		try {
			await this.connection.connect({
				url: Config.database.host,
				username: Config.database.user,
				password: Config.database.pass
			})
		} catch (error) {
			Logger.error(error)
		}
	}
}

export default Database
