import Config from '../../../config.json'
import ORM from 'orango'
const {
    SCHEMA
} = ORM.consts
import Validate from 'joi'

export default class Bots {
    constructor(Database) {
        this.schema = new Database.Schema({

            name: Validate.string()
				.alphanum()
                .min(Config.hotel.registration.name.length.min)
                .max(Config.hotel.registration.name.length.max)
                .required(),

            motto: Validate.string()
				.max(38)
				.default('I\'m just a bot!'),

            inventory: Validate.boolean()
				.default(true)
				.required(),

            owner: Validate.number()
				.integer()
				.required(),

            gender: Validate.boolean()
				.default(true),

            figure: Validate.string(),

            type: Validate.string()
                .valid([
                    'casual',
                    'waiter',
                    'spy'
                ])
                .default('casual')
                .required(),

            state: Validate.array()
                .min(0)
                .items(Validate.objects({
                    type: Validate.string().valid([
                        'moonwalk'
                    ])
                })),

            action: Validate.array()
                .ordered(
                    Validate.string().required(),
                    Validate.number().required()
                )
                .length(2)
                .items(Validate.object({
                    type: Validate.string().valid([
                        'dance',
                        'effect',
                        'wave',
                        'laugh',
                        'kiss',
                        'sit',
                        'lay',
                        'sign',
                        'idle',
                        'static',
                        'freeroam'
                    ]),
                    value: Validate.number().integer()
                })).default(['freeroam', 0]),

            room: Validate.number()
				.integer(),

            position: Validate.array()
                .ordered(
                    Validate.number().integer().required(),
                    Validate.number().integer().required(),
                    Validate.number().integer().required()
                )
                .default([0, 0, 0]),

            rotation: Validate.number()
				.integer(),

            messages: Validaten.array()
                .items(Validate.string().max(100))
                .max(50)
                .default(['Default Message!']),

            chatBubble: Validate.number()
				.integer()
				.default(0),

            chatAuto: Validate.boolean()
				.default(true),

            chatRandom: Validate.boolean()
				.default(true),

            chatDelay: Validate.number()
				.integer()
				.default(4)
        })

        return ORM.model('Bot', this.schema)
    }
}
