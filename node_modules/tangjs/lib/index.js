const Tang = require('./Tang')
const builder = require('./builder')
const EventDispatcher = require('./EventDispatcher')
const factory = require('./factory')
const Model = require('./Model')
const Schema = require('./Schema')
const helpers = require('./helpers')

let tang = new Tang()
tang.builder = builder
tang.EventDispatcher = EventDispatcher
tang.factory = factory
tang.Model = Model
tang.Schema = Schema
tang.helpers = helpers

module.exports = tang
