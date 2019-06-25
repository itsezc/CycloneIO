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

// import roomPlayer from '../hotel/players/player'

import Logger from '../../utils/logger'
import { Socket } from 'net';

import Pathfinder, { AStarFinder, DiagonalMovement, Heuristic, Grid } from 'pathfinding'

export default class Server {
	private readonly hapi: Hapi.Server
	// private readonly socketIO: SocketIO.Server
	private readonly socketIO: any
	private readonly apolloClient: ApolloClient<any>
	private apolloServer: ApolloServer

	private players: any
	private roomId: number

	// private rooms: { [roomId: number]: { id: number } }
	private rooms: any

	private finder: AStarFinder = new AStarFinder({
		diagonalMovement: DiagonalMovement.Always,
		heuristic: Heuristic.manhattan
	})

	public constructor(private readonly config: CycloneConfig) {
		this.config = config

		const { server } = config
		const { port } = server

		this.hapi = new Hapi.Server({
			port: port
		})

		this.roomId = 0
		this.rooms = [
			{
				id: 0,
				name: 'Welcome Room',
				map: [
					'00000',
					'00000',
					'00x00',
					'00000'
				]
			},
			{
				id: 1,
				name: 'Second Room',
				map: [
					'00000',
					'00000'
				]
			}
		]
		this.players = []

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
			await this.connect()

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
		this.socketIO.on('connection', (Socket: any) => {

			Logger.info(`Connected - ${Socket.id}`)

			//this.enterRoom(Socket, this.roomId)

			Socket.on('disconnect', () => {
				this.disconnectPlayer(Socket, Socket.id)
			})

			// let player = {
			// 	x: 0,
			// 	y: 0
			// }

			Socket.on('requestRoom', (roomId: number) => {
				this.requestRoom(Socket, roomId)
			})

			Socket.on('movePlayer', (destination: any) => {
				this.movePlayer(
					[
						[0, 0, 0, 0, 0],
						[0, 0, 0, 0, 0],
						[0, 0, 1, 0, 0],
						[0, 0, 0, 0, 0]
					], Socket.id, destination)
			})

			// Socket.on('tileClick', (mapTiles: any, destination: any) => {
			// 	this.movePlayer(Socket, mapTiles, player, destination)
			// })
		})
	}

	private requestRoom(Socket: any, roomId: number) {
		Logger.info(`Player ${Socket.id} requested room ${roomId}`)

		let room = 'roomID-' + roomId

		this.createPlayer(Socket, roomId)

		// Join SocketIO room
		Socket.join(room)

		this.rooms[roomId] = {
			id: roomId
		}

		this.socketIO.sockets.emit('joinRoom', this.players[Socket.id])

		// console.log('Players', this.players)
		//Socket.emit('currentPlayers', this.getAllPlayers())
	}

	/**
	 * Enters a room
	 * @param {object} socket - The socket connection
	 * @param {object} room - The room to join
	 */
	// private enterRoom(Socket: any, roomId: number) {

	// 	this.rooms[roomId] = {
	// 		id: roomId
	// 	}

	// 	Socket.join('room' + roomId)

	// 	this.players[Socket.id] = {
	// 		roomjoined: roomId 
	// 	}

	// 	Logger.info(`Player ${Socket.id} joined in room: ${this.roomId}`)

	// 	Socket.emit('currentPlayers', this.getAllPlayers())
	// 	Socket.broadcast.in(roomId).emit('newPlayer', this.getPlayerById(Socket.id))
	// }

	/**
	 * Returns all the players
	 */
	getAllPlayers() {
		return this.players
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
	createPlayer(Socket: any, roomToJoin: any) {
		this.players[Socket.id] = {
			rotation: 0,
			x: 0,
			y: 0,
			playerId: Socket.id,
			roomJoined: roomToJoin
		};
	};

	/**
	 * Disconnects a player
	 * @param {object} socket - The socket connection
	 * @param {object} player - The player to disconnect
	 */
	disconnectPlayer(Socket: SocketIO.Socket, player: any) {
		delete this.players[Socket.id]
		Socket.broadcast.in(player.roomJoined).emit('playerDisconnected', Socket.id)
		Logger.info(`User ${Socket.id} disconnected`)
	}

	movePlayer(mapTiles: any, playerId: any, destination: any) {
		console.log(mapTiles)

		var oldPlayerCoordinates = {
			x: this.players[playerId].x,
			y: this.players[playerId].y
		}

		console.log('player coordinates ' + JSON.stringify(oldPlayerCoordinates))

		console.log('destination ' + JSON.stringify(destination))

		if (this.players[playerId].x !== destination.x || this.players[playerId].y !== destination.y) {
			this.players[playerId].x = destination.x;
			this.players[playerId].y = destination.y;

			var grid = this.createMapGrid(mapTiles);
			var path = this.finder.findPath(oldPlayerCoordinates.x, oldPlayerCoordinates.y, this.players[playerId].x, this.players[playerId].y, grid);

			this.socketIO.sockets.emit('playerMoved', this.players[playerId], path, oldPlayerCoordinates, destination)
			console.log('moved')
		}
	}

	/**
	 * Creates the map grid
	 * @param {object} gameMapTiles - The game map tiles
	 */
	createMapGrid(gameMapTiles: any) {
		var grid = new Grid(gameMapTiles)
		return grid
	}

}
