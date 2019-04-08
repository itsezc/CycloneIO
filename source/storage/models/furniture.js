import Orango from 'orango'
import Joi from 'joi'

module.exports = new Orango.Schema(Joi.object().keys({
	id: Joi.string(),
	price: []
}))
