import Chalk from 'chalk'
import Config from '../../../config.json'

import Environment from '../environment'
import EventManager from '../core/events/manager'
import RoomPlayer from '../hotel/rooms/player'

import Hapi from 'hapi'
import Inert from 'inert'
import Routes from './http/routes'

import SocketIO from 'socket.io'

import { prisma } from '../../storage/prisma'
import { typeDefs } from '../../storage/prisma/prisma-schema'
import { resolvers } from '../../storage/resolvers/index'

import { ApolloServer, makeExecutableSchema } from 'apollo-server-hapi'
import ApolloClient, { gql } from 'apollo-boost' 

//import jwt from 'jsonwebtoken'

/**
 * Server class
 */
export default class Server {

	private config: any
	private HTTP: Hapi.Server
	private webSocket!: SocketIO.Server;
	private eventManager!: EventManager
	private database!: ApolloClient<any>
	private apolloServer!: ApolloServer

	/**
	 * @param {JSON} config - The configuration file
	 */
	public constructor(config: JSON) 
	{
        this.config = config

		this.HTTP = new Hapi.Server({
			 port: Config.server.port
		})

		this.start()
	}

	/**
	 * Starts the server
	 */
	public async start(): Promise<void> {
		
        try 
        {
			await this.HTTP.register(Inert)
			await this.HTTP.route(Routes)

			this.webSocket = await SocketIO(this.HTTP.listener)
			await this.webSocket

			Environment.instance._logger.network('Started Socket.IO listener')

			// GraphQL
			let HTTPServer = this.HTTP
			let environment = (this.config.mode === 'development') ? true : false

			Environment.instance._logger.apollo('Started Apollo [GraphQL] listener')

			let schema = makeExecutableSchema({
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
			
			Environment.instance._logger.apollo(`${this.config.mode.charAt(0).toUpperCase() + this.config.mode.slice(1)} environment detected, playground and introspection ${environment ? 'enabled' : 'disabled'}`)

			await this.apolloServer.applyMiddleware({
				app: HTTPServer
			})

			await this.apolloServer.installSubscriptionHandlers(this.HTTP.listener)

			Environment.instance._logger.database('Switched to PostgreSQL connector')
			Environment.instance._logger.database('Connected to Prisma [GraphQL] successfully')

			await this.HTTP.start()

			this.database = new ApolloClient({
				uri: 'http://localhost:8081/graphql'
			})

			this.database.query({
				query: gql`
					{
						rooms {
							id
							name 
							description
							maxUsers
						}
					}
				`
			}).then((result: any) => console.log(result.data.rooms))
			.catch((error: any) => console.error(error))

		} catch (error) {
			this.shutdown(error)
		}	

		Environment.instance._logger.server(`Server running on port ${Chalk.bold(String(this.HTTP.info.port))}`)

		this.webSocket.on('connection', socket => {
			this.handleConnection(socket)
		})
	}

	/**
	 * Handles the connection
	 * @param {Socket} socket - The socket connection
	 */
	public async handleConnection(socket: SocketIO.Socket): Promise<void> {

		Environment.instance._logger.server(`Player ${socket.id} connected`)

		this.eventManager = await new EventManager(socket)
		await this.eventManager
	}

	/**
	 * Shutdown the server
	 * @param {string} error - The error message
	 */
	public async shutdown(error: string): Promise<void> {

		try {

			if (error) {
				throw error
			}

			this.webSocket.emit('shutdown')

			await this.HTTP.stop({
				timeout: 100000
			})
			
			/*.catch((error) => void {
				throw error
			})*/

			Environment.instance._logger.info('Server shutted down.')
			process.exit(0)

		} catch(error) {
		
			Environment.instance._logger.error(error) 
			process.exit(1)
		}
	}
}
