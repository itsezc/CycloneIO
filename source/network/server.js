import Chalk from 'chalk'
import Logger from '../utils/logger'

import Constants from './constants.json'

import SocketIO from 'socket.io'

import Hapi from 'hapi'
import Inert from 'inert'
import Routes from './http/routes'

import { ApolloServer, gql as GQL } from 'apollo-server-hapi'

import RoomPlayer from '../core/rooms/player'

export default class Server {
	constructor() {
		this.HTTP = new Hapi.Server({
			port: 8081
		})



		this.start()
	}

	async start() {

		try {
			await this.HTTP.register(Inert)
			await this.HTTP.route(Routes)

			this.socketIO = new SocketIO(this.HTTP.listener)
			Logger.network('Started SocketIO [Web Sockets] listener')

			let HTTPServer = this.HTTP

			const typeDefs = GQL`
			  type Query {
				"A simple type for getting started!"
				hello: String
			  }
			`;

			const resolvers = {
			  Query: {
				hello: () => 'world',
			  },
			};

			// GraphQL
			this.apolloServer = new ApolloServer({ typeDefs, resolvers, introspection: true, playground: true })
			await this.apolloServer.applyMiddleware({
				app: HTTPServer
			})
			await this.apolloServer.installSubscriptionHandlers(this.HTTP.listener)
			Logger.apollo('Started Apollo [GraphQL] listener')

			await this.HTTP.start()
		} catch (error) {
			Logger.error(error)
			process.exit(1)
		}

		Logger.server(`Server running on port ${this.HTTP.info.port}`)


		this.socketIO.on(Constants.common.server.CONNECTION, (socket) => {
			RoomPlayer.onConnect(socket)

			socket.on(Constants.common.actions.player.DISCONNECT, () => {
				RoomPlayer.onDisconnect(socket)
			})
		})
	}

	shutdown() {
		this.socketIO.emit(Constants.common.this.SHUTDOWN)

		this.HTTP.stop({
			timeout: 100000
		}).then((error) => {
			Logger.error(error)
		})

		Logger.info('Server shutted down.')
		process.exit(0)
	}
}
