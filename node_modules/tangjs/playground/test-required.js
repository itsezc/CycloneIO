const Joi = require('joi')
const Schema = require('../lib/Schema')
const parseRequiredPaths = require('../lib/helpers/getRequiredPaths')
require('colors')

let result = parseRequiredPaths({
  list: [
    { name: { type: String, required: true } }
  ]
  // r0: String,
  // r1: {
  //   type: String,
  //   required: true
  // },
  // r2: {
  //   type: String,
  //   required: 'create'
  // },
  // r3: {
  //   type: String,
  //   required: 'update'
  // },
  // r4: {
  //   optional: 'create',
  //   // r5: {
  //   //   type: String,
  //   //   required: true
  //   // },
  //   r6: {
  //     type: String,
  //     required: 'create'
  //   },
    // r7: {
    //   type: String,
    //   required: ['update', 'test2']
    // }
  // }
})
// console.log(JSON.stringify(result.getScopes(), '', 3))
// return
let schema = new Schema({
  name: {
    type: String,
    required: 'create'
  },
  settings: {
    active: {
      type: Boolean,
      // default: false,
      required: 'update'
    },
    // locale: {
    //   type: String,
    //   default: 'en-US',
    //   require: true
    // }
  },
  tags: [{
    id: {
      type: Number,
      required: true
    },
    name: String
  }]
  // tags: [ Joi.number().required() ]
  // tags: Joi.array().items(Joi.string().valid('a', 'b'))
})

async function main() {
  try {
    let result = await schema
      .validate({
        name: 'rob',
        // settings: {}
        // tags: [{id: 1}]
      }, {
        // required: 'tags.$children.id'
        scope: 'create'
      })
    console.log('result #1'.green, result)
  } catch (e) {
    console.log('whoops #1'.red, e.message)
  }

  // try {
  //   let result = await schema
  //     .validate({
  //       name: 'rob',
  //       settings: {}
  //     })
  //   console.log('result #2'.green, result)
  // } catch (e) {
  //   console.log('whoops #2'.red, e.message)
  // }
}

main()