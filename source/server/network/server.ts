import Hapi from '@hapi/hapi'
import Inert from '@hapi/inert'
import Routes from './http/routes'

import SocketIO from 'socket.io'

import { ApolloClient } from 'apollo-client'
import { HttpLink as ApolloLink } from 'apollo-link-http'
import { InMemoryCache as ApolloCache } from 'apollo-cache-inmemory'

import CycloneConfig from '../../common/types/config'

import Logger from '../../utils/logger'

export default class Server {
	private readonly hapi: Hapi.Server
	private readonly socketIO: SocketIO.Server
	private readonly database: ApolloClient<any>

	public constructor(private readonly config: CycloneConfig) {
		const { server } = config
		const { port } = server

		this.hapi = new Hapi.Server({
			port: port
		})

		this.socketIO = SocketIO(this.hapi.listener)

		this.database = new ApolloClient({
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
		}

		catch (error) {
			Logger.error(error)
		}
	}
}
