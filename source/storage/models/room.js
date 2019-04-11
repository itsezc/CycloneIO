import Config from '../../../config.json'
import Orango from 'orango'
const { SCHEMA } = Orango.consts
import Joi from 'joi'

class Room {
	constructor(Database) {
		this.schema = new Database.Schema({
			name: Joi.string().alphanum().min(3).max(25).required(),
			description: Joi.string().max(100),
			owner: Joi.number().required(),
			maxUsers: Joi.number().default(10),
			tradingEnabled: Joi.boolean().default(true),
			effectsEnabled: Join.boolean().default(true)
		}, {
			indexes: [
				{
					type: SCHEMA.INDEX.HASH,
					fields: ['username', 'email', 'rank', 'vipRank']
				}
			]
		})

		return Orango.model('User', this.schema)
	}
}

export default Room
