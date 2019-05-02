// @flow
import Chalk from 'chalk'

import Logger from '../utils/logger'

import Hapi from 'hapi'
import Inert from 'inert'
import Routes from './http/routes'

import { prisma } from '../storage/prisma'
import { typeDefs } from '../storage/prisma/prisma-schema'
import { resolvers } from '../storage/resolvers/resolver'
//import { ApolloServer, gql as GQL } from 'apollo-server-hapi'

import jwt from 'jsonwebtoken'

import SocketIO from 'socket.io'

import RoomPlayer from '../core/rooms/player'

export default class Server {

    config: Object
    HTTP: Hapi
	io: SocketIO
	//apolloServer: Object

	constructor(config: Object) {

		this.config = config

		this.HTTP = new Hapi.Server({
			port: 8081
		})
		
		this.start()
	}

	async start() {

		try {
			await this.HTTP.register(Inert)
			await this.HTTP.route(Routes)

			// Web Sockets
			this.io = new SocketIO(this.HTTP.listener)
			await this.io

			Logger.network('Started SocketIO [Web Sockets] listener')

			// Database : GraphQL
			// let HTTPServer = this.HTTP
			// let environment = (this.config.mode == 'development') ? true : false

			// Logger.apollo('Started Apollo [GraphQL] listener')
			// this.apolloServer = new ApolloServer({ 
			// 	typeDefs,
			// 	resolvers,
			// 	introspection: environment, 
			// 	playground: environment,
			// 	context: {
			// 		db: prisma
			// 	}
			// })
			// Logger.apollo(`${this.config.mode.charAt(0).toUpperCase() + this.config.mode.slice(1)} environment detected, playground and introspection ${environment ? 'enabled' : 'disabled'}`)

			// await this.apolloServer.applyMiddleware({
			// 	app: HTTPServer
			// })
			// await this.apolloServer.installSubscriptionHandlers(this.HTTP.listener)

			// Logger.database('Switched to PostgreSQL connector')
			// Logger.database('Connected to Prisma [GraphQL] successfully')

			await this.HTTP.start()

		} catch (error) {
			Logger.error(error)
			process.exit(1)
		}

		Logger.server(`Server running on port ${Chalk.bold(this.HTTP.info.port)}`)

		this.io.on('connection', (socket) => {
			RoomPlayer.onConnect(socket)

			socket.on('disconnect', () => {
				RoomPlayer.onDisconnect(socket)
			})
		})
	}

	shutdown() {
		this.io.emit('shutdown')

		this.HTTP.stop({
			timeout: 100000
		}).then((error) => {
			Logger.error(error)
		})

		Logger.info('Server shutted down.')
		process.exit(0)
	}
}
