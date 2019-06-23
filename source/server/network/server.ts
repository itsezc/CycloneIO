import Hapi from '@hapi/hapi'
import Inert from '@hapi/inert'
import Routes from './http/routes'

import SocketIO from 'socket.io'

import { ApolloClient } from 'apollo-client'
import { HttpLink as ApolloLink } from 'apollo-link-http'
import { InMemoryCache as ApolloCache } from 'apollo-cache-inmemory'

import { prisma } from '../../storage/prisma'
import { typeDefs } from '../../storage/prisma/prisma-schema'
import { resolvers } from '../../storage/resolvers/index'

import { ApolloServer, makeExecutableSchema } from 'apollo-server-hapi'

import gql from 'graphql-tag'

import CycloneConfig from '../../common/types/config'

import Logger from '../../utils/logger'

export default class Server {
	private readonly hapi: Hapi.Server
	private readonly socketIO: SocketIO.Server
	private readonly apolloClient: ApolloClient<any>
	private apolloServer: ApolloServer

	public constructor(private readonly config: CycloneConfig) {
		this.config = config

		const { server } = config
		const { port } = server

		this.hapi = new Hapi.Server({
			port: port
		})

		this.socketIO = SocketIO(this.hapi.listener)

		this.apolloClient = new ApolloClient({
			link: new ApolloLink({
				uri: 'http://localhost:8081/graphql'
			}),
			cache: new ApolloCache(),
			name: 'Database'
		})

		this.run()
	}

	private async run(): Promise<void> {
		try {
			await this.hapi.register(Inert)
			await this.hapi.route(Routes)
			await this.socketIO

			Logger.info('Started Socket.IO listener')

			var environment = (this.config.mode === 'development') ? true : false

			Logger.info('Started Apollo [GraphQL] listener')

			const schema = makeExecutableSchema({
				typeDefs,
				resolvers,
				resolverValidationOptions: {
					requireResolversForResolveType: false
				}
			})

			this.apolloServer = new ApolloServer({
				schema,
				context: {
					db: prisma
				}
			})

			Logger.info(`${this.config.mode.charAt(0).toUpperCase() + this.config.mode.slice(1)} environment detected, playground and introspection ${environment ? 'enabled' : 'disabled'}`)

			await this.apolloServer.applyMiddleware({
				app: this.hapi
			})

			await this.apolloServer.installSubscriptionHandlers(this.hapi.listener)

			Logger.info('Switched to PostgreSQL connector')
			Logger.info('Connected to Prisma [GraphQL] successfully')

			await this.hapi.start()
		}

		catch (error) {
			Logger.error(error)
		}

		this.apolloClient.query({
			query:
				gql`
							{
								rooms(
									where: {
										currentUsers_gt: 0
									}
								) {
									id
									name
									maxUsers
									currentUsers
								}
							}
						`
		}).then((result: any) => console.log(result.data.rooms))
			.catch((error: any) => console.error(error))
	}
}
