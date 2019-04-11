import Config from '../../../config.json'
import Orango from 'orango'
const { SCHEMA } = Orango.consts
import Joi from 'joi'

class Bots {
	constructor(Database) {
		this.schema = new Database.Schema({
			name: Joi.string().alphanum().min(3).max(25).required(),
			motto: Joi.string().max(100),
			figure: Joi.string(),
			gender: Joi.boolean().default(true),
			freeroam: Joi.boolean().default(true),
			position: Joi.array().default([0, 0, 0]),
			roomID: Joi.number(),
			ownerID: Joi.number().required(),
			chatMessages: Join.array().items(Joi.string()),
			chatAuto: Joi.boolean().default(true),
			chatRandom: Joi.boolean().default(true),
			chatDelay: Joi.number().default(5),

		}
		// , {
		// 	indexes: [
		// 		{
		// 			type: SCHEMA.INDEX.HASH,
		// 			fields: ['username', 'email', 'rank', 'vipRank']
		// 		}
		// 	]
		// })

		return Orango.model('User', this.schema)
	}
}

export default Bots
