const Joi = require('joi')
const getRequiredPaths = require('./helpers/getRequiredPaths')
// const getObjectKeys = require('./helpers/getObjectKeys')
const JSONstringify = require('./helpers/jsonStringify')
require('colors')

const props = 'statics methods computed'.split(' ')

class Schema {
  constructor(json, options = {}) {
    this.isSchema = true

    if (!json || (typeof json !== 'object' && !Object.keys(json).length)) {
      throw new Error('Schema expects object with at least one key/value pair')
    }

    this._requiredKeys = getRequiredPaths(json)

    for (let i = 0; i < props.length; i++) {
      let prop = props[i]
      this[prop] = json[prop] || {}
      // delete json[prop]
    }

    this._json = json
    this._options = options
    this._joi = this._parse(json)
    this._joi.validate(
      {},
      {
        skipFunctions: true,
        presence: 'optional',
        noDefaults: false
      },
      (err, value) => {
        this._defaultValues = value
      }
    )
    // this._schemaKeys = getObjectKeys(json)
  }

  get options() {
    return this._options
  }

  // get schemaKeys() {
  //   return this._schemaKeys
  // }

  get json() {
    return this._json
  }

  get joi() {
    return this._joi
  }

  get defaultValues() {
    return this._defaultValues
  }

  validate(data, options = {}) {
    let joi = this._joi
    let { scope, required } = options
    if (scope || required) {
      delete options.scope
      delete options.required
      if (required) {
        joi = joi.requiredKeys(required)
      } else if (scope) {
        joi = joi.requiredKeys(this._requiredKeys.getPaths(scope))
      }
    }
    return joi.validate(data, options)
  }

  // requiredKeys(keys) {
  //   console.log('keys', keys)
  //   return this._joi.requiredKeys(keys)
  // }

  _parse(data) {
    // check if there is a schema, if so this is a reference to a model
    if (data.schema) {
      return data.schema.joi
    }
    // get data type
    let type = this._parseType(data)
    // if it is already a joi schema then return it
    if (type === 'joi') {
      return data.type || data
    } else if (type === 'types') {
      let validTypes = []
      for (let i = 0; i < data.type.length; i++) {
        validTypes[i] = this._parse(data.type[i])
      }
      return validTypes
    }

    // create a joi type schema
    let joiType
    try {
      joiType = Joi[type]()
    } catch (e) {
      let t = JSONstringify(type)
      throw new Error(`Joi does not support the type ${t}`)
    }

    if (type === 'object') {
      // if the type is an object then loop through and get child schemas
      let schema = {}

      for (let prop in data) {
        if (data.hasOwnProperty(prop)) {
          schema[prop] = this._parse(data[prop])
          // do not parse array attributes
          if (data[prop].type) {
            this._parseAttrs(prop, schema[prop], data, (val) => {
              schema[prop] = val
            })
          }
        }
      }
      joiType = joiType.append(schema)
      // check if any children have default values, if so we have to create
      // a default object so it displays properly
      if (Object.keys(data).length && JSONstringify(data).match(/"default":/gi)) {
        const defaultObject = this._createDefaultObject(data)
        joiType = joiType.default(defaultObject)
      }
    } else if (type === 'array') {
      // array of valid objects
      if (data.length) {
        let arrayItems = []
        for (let i = 0; i < data.length; i++) {
          arrayItems[i] = this._parse(data[i])
        }
        joiType = Joi.array().items(arrayItems)
      } else {
        joiType = Joi.array().items(Joi.any())
      }
    }

    return joiType
  }

  _parseType(item, prop = '') {
    if (item === null || item === undefined) {
      throw new Error(`Property "${prop}" cannot be null or undefined`)
    }
    let type = typeof item
    // if object has a type and it isn't a property called "type"
    if (item.type && !item.type.type) {
      type = this._parseType(item.type, 'type')
    }
    switch (type) {
      case 'object':
        type = item.type
        if (item.isSchema) {
          return 'schema'
        }
        if (item.isJoi) {
          return 'joi'
        }
        if (item instanceof Date) {
          return 'date'
        }
        if (item instanceof Array) {
          return 'array'
        }
        if (type === Object) {
          return 'object'
        }
        return 'object'
      case 'function':
        if (item === String) {
          return 'string'
        }
        if (item === Number) {
          return 'number'
        }
        if (item === Boolean) {
          return 'boolean'
        }
        if (item === Date) {
          return 'date'
        }
        if (item === Array) {
          return 'array'
        }
        if (item === Object) {
          return 'object'
        }
        if (item === Function) {
          return 'func'
        }
        if (item.toString().indexOf('[native code]') === -1) {
          return 'func'
        }
        return 'object'
      case 'array':
        return 'types'
      default:
        return type
    }
  }

  _parseAttrs(prop, joiType, data, callback) {
    let item = data[prop]
    if (typeof item !== 'function') {
      for (let attr in item) {
        // do not parse type
        if (attr !== 'type') {
          let val = item[attr]
          try {
            if (typeof val === 'function') {
              joiType = joiType[attr](val, `default function() for ${prop}`)
            } else {
              joiType = joiType[attr](val)
            }
          } catch (e) {
            console.log('Error', e.message)
            throw new Error(`Invalid attribute "${prop}"`)
          }
        }
      }
    }
    callback(joiType)
  }

  _createDefaultObject(data) {
    let defaultValue = {}
    for (let prop in data) {
      if (data[prop].hasOwnProperty('default')) {
        defaultValue[prop] = data[prop].default
      } else {
        let type = this._parseType(data[prop], prop)
        if (type === 'object') {
          defaultValue[prop] = this._createDefaultObject(data[prop])
        }
      }
    }
    return defaultValue
  }
}

Schema.Types = {
  String,
  Number,
  Boolean,
  Object,
  Array,
  Date,
  RegExp,
  Id: Joi.any(), // TODO: Do something here, not sure what
  Any: Joi.any(),
  Mixed: Joi.any()
}

module.exports = Schema
