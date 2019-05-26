// @flow
import Chalk from 'chalk'
import Config from '../../../config.json'

import Environment, { logger } from '../environment'
import EventManager from '../core/events/manager'
import RoomPlayer from '../hotel/rooms/player'

import Hapi from 'hapi'
import Inert from 'inert'
import Routes from './http/routes'

import SocketIO from 'socket.io'

// import { prisma } from '../storage/prisma'
// import { typeDefs } from '../storage/prisma/prisma-schema'
// import { resolvers } from '../storage/resolvers'

// import { ApolloServer, makeExecutableSchema } from 'apollo-server-hapi'
// import ApolloClient, { gql } from 'apollo-boost' 

import jwt from 'jsonwebtoken'

/**
 * Server class
 */
export default class Server {

    config: JSON
    HTTP: Hapi
    WebSocket: SocketIO
    eventManager: EventManager

    /**
     * @param {JSON} config - The configuration file
     */
    constructor(config: JSON): void {
        this.config = config

        this.HTTP = new Hapi.Server({
            port: Config.server.port
        })

        this.start()
    }

    /**
     * Starts the server
     */
    async start(): Promise<void> {
        try {
            await this.HTTP.register(Inert)
            await this.HTTP.route(Routes)

            this.webSocket = await new SocketIO(this.HTTP.listener)
            await this.webSocket

            logger.network('Started Socket.IO listener')

            // // GraphQL
            // let HTTPServer = this.HTTP
            // let environment = (this.config.mode === 'development') ? true : false

            // logger.apollo('Started Apollo [GraphQL] listener')

            // let schema = makeExecutableSchema({
            //     typeDefs,
            //     resolvers,
            //     resolverValidationOptions: { 
            //         requireResolversForResolveType: false
            //     },
            //     introspection: environment,
            // 	playground: environment
            // })

            // this.apolloServer = new ApolloServer({
            //     schema,  	
            // 	context: {
            // 		db: prisma
            // 	}
            // })
            
            // logger.apollo(`${this.config.mode.charAt(0).toUpperCase() + this.config.mode.slice(1)} environment detected, playground and introspection ${environment ? 'enabled' : 'disabled'}`)

            // await this.apolloServer.applyMiddleware({
            // 	app: HTTPServer
            // })

            // await this.apolloServer.installSubscriptionHandlers(this.HTTP.listener)

           	// logger.database('Switched to PostgreSQL connector')
            // logger.database('Connected to Prisma [GraphQL] successfully')

            await this.HTTP.start()

			// this.database = new ApolloClient({
			// 	uri: 'http://localhost:8081/graphql'
			// })

			// this.database.query({
			// 	query: gql`
			// 		{
			// 			rooms {
			// 				id
			// 				name 
			// 				description
			// 				maxUsers
			// 			}
			// 		}
			// 	`
			// }).then(result => console.log(result.data.rooms))
			// .catch(error => console.error(error))

        } catch (error) {
            this.shutdown(error)
        }	

        logger.server(`Server running on port ${Chalk.bold(this.HTTP.info.port)}`)

        this.webSocket.on('connection', socket => {
            this.handleConnection(socket)
        })
    }

    /**
     * Handles the connection
     * @param {SocketIO} socket - The socket connection
     */
    async handleConnection(socket: SocketIO): Promise<void> {
        logger.server(`Player ${socket.id} connected`)
        this.eventManager = await new EventManager(socket)
        await this.eventManager
    }

    /**
     * Shutdown the server
     * @param {string} error - The error message
     */
    async shutdown(error: string): Promise<void> {

        try {

            if (error) {
                throw error
			}

            this.WebSocket.emit('shutdown')

            await this.HTTP.stop({
                timeout: 100000
            }).then(error => {
                throw error
            })

            logger.info('Server shutted down.')
            process.exit(0)

        } catch(error) {
           	logger.error(error)
            process.exit(1)
        }
    }
}
