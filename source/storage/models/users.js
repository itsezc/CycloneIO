import Config from '../../../config.json'
import Orango from 'orango'
const { SCHEMA } = Orango.consts
import Joi from 'joi'

export default class User {
	constructor(Database) {
		this.schema = new Database.Schema({
			email: Joi.string().email({ minDomainAtoms: 2 }).required(),

			username: Joi.string().alphanum().min(Config.hotel.registration.name.length.min).max(Config.hotel.registration.name.length.max).required(),

			password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),

			pin: Joi.number().min(6).max(6).required(),

			online: Joi.boolean().default(false),

			verified: Joi.boolean().default(false),

			motto: Joi.string().max(38).default(Config.hotel.registration.motto),

			rank: Joi.number().default(Config.hotel.registration.rank),

			vipRank: Joi.number().default(Config.hotel.registration.vip),

			home: Joi.number().default(Config.hotel.registration.room),

			avatar: Joi.string(),

			volume: Joi.number().min(0).max(15).default(10),

			muted: Joi.boolean().default(false),
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

// const defaultAvatar = Config.hotel.registration.avatar || avatar

// module.exports = (Orango) =>  {
// 	let schema = new Orango.Schema({
//
// 		email: Joi.string().email({ minDomainAtoms: 2 }).required(),
//
// 		username: Joi.string().alphanum().min(3).max(30).required(),
//
// 		password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
//
// 		pin: Joi.number().min(6).max(6).required(),
//
// 		online: Joi.boolean().default(false),
//
// 		verified: Joi.boolean().default(false),
//
// 		// registered: Joi.date().default(Date.now).iso(),
// 		//
// 		// registeredIp: Joi.ip().required(),
// 		//
// 		// ip: Joi.ip(),
//
// 		motto: Joi.string().max(50).default(Config.hotel.registration.motto),
//
// 		rank: Joi.number().default(Config.hotel.registration.rank),
//
// 		vipRank: Joi.number().default(Config.hotel.registration.vip),
//
// 		home: Joi.number().default(Config.hotel.registration.room),
//
// 		avatar: Joi.string(),
//
// 		volume: Joi.number().min(0).max(15).default(10),
//
// 		muted: Joi.boolean().default(false),
//
// 	}, {
// 		indexes: [
// 			{
// 				type: SCHEMA.INDEX.HASH,
// 				fields: ['username', 'email', 'rank', 'vipRank']
// 			}
// 		]
// 	})
//
// 	return Orango.model('User', schema)
// }
