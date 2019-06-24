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
import { Socket } from 'net';

export default class Server {
	private readonly hapi: Hapi.Server
	private readonly socketIO: SocketIO.Server
	private readonly apolloClient: ApolloClient<any>
	private apolloServer: ApolloServer

	private rooms: { [roomId: number]: { id: number } }

	public constructor(private readonly config: CycloneConfig) {
		this.config = config

		const { server } = config
		const { port } = server

		this.hapi = new Hapi.Server({
			port: port
		})

		this.socketIO = SocketIO(this.hapi.listener)

		// this.apolloClient = new ApolloClient({
		// 	link: new ApolloLink({
		// 		uri: 'http://localhost:8081/graphql'
		// 	}),
		// 	cache: new ApolloCache(),
		// 	name: 'Database'
		// })

		this.run()
	}

	private async run(): Promise<void> {
		try {
			await this.hapi.register(Inert)
			await this.hapi.route(Routes)

			await this.socketIO
			await this.connect()

			Logger.info('Started Socket.IO listener')

			var environment = (this.config.mode === 'development') ? true : false

			Logger.info('Started Apollo [GraphQL] listener')

			// const schema = makeExecutableSchema({
			// 	typeDefs,
			// 	resolvers,
			// 	resolverValidationOptions: {
			// 		requireResolversForResolveType: false
			// 	}
			// })

			// this.apolloServer = new ApolloServer({
			// 	schema,
			// 	context: {
			// 		db: prisma
			// 	}
			// })

			// Logger.info(`${this.config.mode.charAt(0).toUpperCase() + this.config.mode.slice(1)} environment detected, playground and introspection ${environment ? 'enabled' : 'disabled'}`)

			// await this.apolloServer.applyMiddleware({
			// 	app: this.hapi
			// })

			// await this.apolloServer.installSubscriptionHandlers(this.hapi.listener)

			Logger.info('Switched to PostgreSQL connector')
			Logger.info('Connected to Prisma [GraphQL] successfully')

			await this.hapi.start()
		}

		catch (error) {
			Logger.error(error)
		}

		/* 		this.apolloClient.query({
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
				  .catch((error: any) => console.error(error)) */


	}

	private connect() {
		this.socketIO.on('connection', (socket: SocketIO.Socket) => {

			const roomId = 0

			Logger.info(`Connected - ${Socket.id}`)

			this.enterRoom(socket, roomId)

			socket.on('disconnect', function () {
				this.disconnectPlayer(socket);
			})

			socket.on('tileClick', (mapTiles, destination) => {
				movePlayer(socket, mapTiles, destination);
			});

		})
	}

	/**
	 * Enters a room
	 * @param {object} socket - The socket connection
	 * @param {object} room - The room to join
	 */
	private enterRoom(socket: SocketIO.Socket, roomId: number) {
		this.rooms[roomId] = {
			id: roomId
		};
		socket.join('room' + roomId);

		roomPlayer.getPlayerById(socket.id).roomJoined = room.id;

		Logger.info(`Player ${socket.id} joined in room: ${room.id}`);

		socket.emit('currentPlayers', roomPlayer.getAllPlayers());
		socket.broadcast.in(roomId).emit('newPlayer', roomPlayer.getPlayerById(socket.id));
	}

	/**
	 * Returns all the players
	 */
	getAllPlayers() {
		return this.players;
	}

	/**
	 * Returns a player by the given id
	 * @param {number} playerId - The player id
	 */
	getPlayerById(playerId: number) {
		return this.players[playerId]
	};

	/**
	 * Creates a player
	 * @param {object} socket - The socket connection
	 */
	createPlayer(socket) {
		players[socket.id] = {
			rotation: 0,
			x: 0,
			y: 0,
			playerId: socket.id,
			roomJoined: -1
		};
	};

	/**
	 * Disconnects a player
	 * @param {object} socket - The socket connection
	 * @param {object} player - The player to disconnect
	 */
	disconnectPlayer(socket: SocketIO.Socket, player: any) {
		delete this.players[socket.id];
		socket.broadcast.in(player.roomJoined).emit('playerDisconnected', socket.id);
		Logger.info(`User ${socket.id} disconnected`);
	}

	movePlayer(io, mapTiles, player, destination) {
		var oldPlayerCoordinates = {
			x: player.x,
			y: player.y
		};

		if (player.x !== destination.x || player.y !== destination.y) {
			// TODO: player movements
			player.x = destination.x;
			player.y = destination.y;
			// TODO: player rotation

			var grid = gameMap.createMapGrid(mapTiles);
			var path = gameMap.finder.findPath(oldPlayerCoordinates.x, oldPlayerCoordinates.y, player.x, player.y, grid);

			io.sockets.emit('playerMoved', player, path, oldPlayerCoordinates, destination);
		}
	};


}
