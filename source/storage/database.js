import Config from '../../config.json'
import Orango from 'orango'

class Database {
	constructor() {
		Orango.get(Config.database.home).connect()
	}
}
