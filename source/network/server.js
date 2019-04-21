import Chalk from 'chalk'
import Logger from '../utils/logger'

import SocketIO from 'socket.io'

import Hapi from 'hapi'
import Inert from 'inert'
import Routes from './http/routes'

import { ApolloServer, gql as GQL } from 'apollo-server-hapi'

import RoomPlayer from '../core/rooms/player'

export default class Server {

	constructor(config) {

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
			this.socketIO = new SocketIO(this.HTTP.listener)
			Logger.network('Started SocketIO [Web Sockets] listener')

			// GraphQL
			let HTTPServer = this.HTTP

			const typeDefs = GQL`
			  type Query {
				"A simple type for getting started!"
				hello: String
			  }
			`;

			const resolvers = {
			  Query: {
				hello: () => 'world'
			  },
			};


			Logger.apollo('Started Apollo [GraphQL] listener')

			if(this.config.mode == 'production') {
				 this.apolloServer = new ApolloServer({ typeDefs, resolvers, introspection: false, playground: false })
				 Logger.apollo('Production environment detected, playground and introspection disabled')
			 } else {
				 this.apolloServer = new ApolloServer({ typeDefs, resolvers, introspection: true, playground: true, })
				 Logger.apollo('Development environment detected, playground and introspection enabled')
			 }

			await this.apolloServer.applyMiddleware({
				app: HTTPServer
			})
			await this.apolloServer.installSubscriptionHandlers(this.HTTP.listener)

			Logger.database('Switched to PostgreSQL connector')
			Logger.database('Connected to Prisma [GraphQL] successfully')

			await this.HTTP.start()

		} catch (error) {
			Logger.error(error)
			process.exit(1)
		}

		Logger.server(`Server running on port ${Chalk.bold(this.HTTP.info.port)}`)


		this.socketIO.on('connection', (socket) => {
			RoomPlayer.onConnect(socket)

			socket.on('disconnect', () => {
				RoomPlayer.onDisconnect(socket)
			})
		})
	}

	shutdown() {
		this.socketIO.emit('shutdown')

		this.HTTP.stop({
			timeout: 100000
		}).then((error) => {
			Logger.error(error)
		})

		Logger.info('Server shutted down.')
		process.exit(0)
	}
}
