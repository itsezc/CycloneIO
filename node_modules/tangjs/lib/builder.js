const asyncForEach = require('./helpers/asyncForEach')
const snooze = require('./helpers/snooze')
require('colors')

class Builder {
  constructor() {
    this.methods = {}

    this.addMethod('convertTo', function(data, index, items, Model) {
      if (Model === data.constructor) {
        return data
      }
      return new Model(data)
    })

    this.addMethod('toObject', function(model, index, items, options) {
      if (model.toObject) {
        return model.toObject(options)
      }
      throw new Error('toObject() requires first element to be of type Model')
    })

    this.addMethod('inspect', function(target, index, items, note = 'Inspect') {
      console.log(note, `[${index}] =>`, target)
      return target
    })

    this.addMethod('intercept', async function(target, index, items, handler) {
      let result = await handler(target, index || 0)
      if (result === undefined) {
        return target
      }
      return result
    })
  }

  data(data) {
    this.isArray = data instanceof Array
    this.items = [].concat(data)
    this.queue = []
    return this
  }

  addMethod(name, method) {
    this[name] = function() {
      let args = [].slice.call(arguments)
      this.queue.push({
        method,
        args
      })
      return this
    }
  }

  async build() {
    let items = this.items
    let validItems = []
    let returnItem = await asyncForEach(items, async (item, index) => {
      if (this.queue.length) {
        let result = await asyncForEach(this.queue, async message => {
          let args = [].concat(item, index, [items], message.args)
          // force releasing of the thread
          await snooze()
          item = await message.method.apply(this, args)
          return item
        })
        if (result instanceof Error) {
          return result
        }
        validItems.push(result)
      }
      return item
    })
    if (returnItem instanceof Error) {
      return Promise.reject(returnItem)
    }

    if (this.isArray) {
      return validItems
    }
    return returnItem
  }
}

module.exports = () => {
  return new Builder()
}
