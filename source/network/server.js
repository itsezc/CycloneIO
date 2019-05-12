import Chalk from 'chalk'

import Environment from '../environment'
import EventManager from '../core/events/manager'

import Hapi from 'hapi'
import Inert from 'inert'
import Routes from './http/routes'

import { prisma } from '../storage/prisma'
import { typeDefs } from '../storage/prisma/prisma-schema'
import { resolvers } from '../storage/resolvers'
import { ApolloServer, makeExecutableSchema, gql as GQL } from 'apollo-server-hapi'

import jwt from 'jsonwebtoken'

import SocketIO from 'socket.io'

import RoomPlayer from '../core/hotel/rooms/player'

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

            this.io = new SocketIO(this.HTTP.listener)
            await this.io

            Environment.instance.logger.network('Started Socket.IO listener')

            // GraphQL
            let HTTPServer = this.HTTP
            let environment = (this.config.mode === 'development') ? true : false

            Environment.instance.logger.apollo('Started Apollo [GraphQL] listener')

            let schema = makeExecutableSchema({
                typeDefs,
                resolvers,
                resolverValidationOptions: { 
                    requireResolversForResolveType: false
                },
                introspection: environment,
            	playground: environment
            })

            this.apolloServer = new ApolloServer({
                schema,  	
            	context: {
            		db: prisma
            	}
            })
            
            Environment.instance.logger.apollo(`${this.config.mode.charAt(0).toUpperCase() + this.config.mode.slice(1)} environment detected, playground and introspection ${environment ? 'enabled' : 'disabled'}`)

            await this.apolloServer.applyMiddleware({
            	app: HTTPServer
            })

            await this.apolloServer.installSubscriptionHandlers(this.HTTP.listener)

            Environment.instance.logger.database('Switched to PostgreSQL connector')
            Environment.instance.logger.database('Connected to Prisma [GraphQL] successfully')

            await this.HTTP.start()

        } catch (error) {
            this.shutdown(error)
        }

        Environment.instance.logger.server(`Server running on port ${Chalk.bold(this.HTTP.info.port)}`)

        this.io.on('connection', socket => {
            this.handleConnection(socket)
        })
    }

    async handleConnection(socket) {
        Environment.instance.logger.server(`Player ${socket.id} connected`)
        await new EventManager(socket)
    }

    async shutdown(error) {

        try {

            if (error) {
                throw error
            }

            this.io.emit('shutdown')

            await this.HTTP.stop({
                timeout: 100000
                
            }).then(error => {
                throw error
            })

            Environment.instance.logger.info('Server shutted down.')
            process.exit(0)

        } catch(error) {
            Environment.instance.logger.error(error)
            process.exit(1)
        }
    }
}
