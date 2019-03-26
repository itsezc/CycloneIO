  const sortedUniq = require('lodash/sortedUniq')
  const TRUE = 'true'
  const ALL = 'all'

  function getKey(key, prefix = '') {
    return (prefix ? prefix + '.' : '') + key
  }

  function parsePath(path) {
    let list = []
    let props = path.split('.')
    let paths = []
    for (let prop of props) {
      paths.push(prop)
      if (list.indexOf(prop) === -1) {
        list.push(paths.join('.'))
      }
    }
    return list
  }

  function toArray(val) {
    let arr = val // assume val is an array
    if (val === true) {
      arr = [TRUE]
    }

    if (typeof val === 'string') {
      arr = val.split(' ')
    }

    arr.push(ALL)
    return arr
  }

  class RequiredKeys {
    constructor(data) {
      this.scopes = {}
      this.parse(data)
    }

    parse(data, keys = [], prefix = '') {
      if(data.isJoi) {
        return data
      }
      
      for (let key in data) {
        if (key === 'required') {
          let scope = data[key]
          let parsedPaths = parsePath(prefix)
          let scopes = toArray(scope)
          for (let _scope of scopes) {
            _scope = (_scope + '').trim()
            if (_scope) {
              if (!this.scopes[_scope]) {
                this.scopes[_scope] = []
              }
              this.scopes[_scope] = this.scopes[_scope].concat(parsedPaths)
            }
          }
          delete data[key]
        } else if (typeof data[key] === 'object') {
          if (!(data[key] instanceof Array)) {
            let k = this.parse(data[key], [], getKey(key, prefix))
            keys = keys.concat(k)
          }
        }
      }
      return this
    }

    getScopes() {
      return this.scopes
    }

    getPaths(scope) {
      if(scope === TRUE) {
        return this.scopes[scope] || []
      }
      return sortedUniq([].concat(this.scopes[TRUE] || '', this.scopes[scope] || '').sort())
    }

  }
  module.exports = (data) => {
    return new RequiredKeys(data)
  }