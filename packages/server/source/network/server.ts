import Hapi from '@hapi/hapi'
import Inert from '@hapi/inert'
import Routes from './socket/routes'

import SocketIO from 'socket.io'
import Moment from 'moment'


import { ApolloClient } from 'apollo-client'
import { HttpLink as ApolloLink } from 'apollo-link-http'
import { InMemoryCache as ApolloCache } from 'apollo-cache-inmemory'

import { prisma } from '../../../storage/prisma'
import { typeDefs } from '../../../storage/prisma/prisma-schema'
import { resolvers } from '../../../storage/resolvers/index'

import gql from 'graphql-tag'

import CycloneConfig from '../../../common/types/config'
import {CycloneSocket} from './socket/types/cycloneSocket'

// import roomPlayer from '../hotel/players/player'

import Logger from '../../../utils/logger'

import { AStarFinder, DiagonalMovement, Heuristic, Grid } from 'pathfinding'

import createAPIServer from './api/APIServer'
import createEmulatorServer from './socket/SocketServer'

import IO from 'fs'
import path from 'path'

export default class Server {
	private emulator: Hapi.Server
	private API: Hapi.Server
	private socket: SocketIO.Server
	private readonly apolloClient: ApolloClient<any>

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
		this.players = {}

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

			this.emulator = await createEmulatorServer(this.config)
			this.socket = SocketIO(this.emulator.listener)

			this.socket.on('connection', (socket) => {
				this.loadSocketEvents(socket, this.socket)
			})

			Logger.info('Started Socket.IO listener')

			var environment = (this.config.mode === 'development') ? true : false

			this.API = await createAPIServer(this.config)

			Logger.info('Started Apollo [GraphQL] listener')
			Logger.info(`${this.config.mode.charAt(0).toUpperCase() + this.config.mode.slice(1)} environment detected, playground and introspection ${environment ? 'enabled' : 'disabled'}`)
			Logger.info('Switched to PostgreSQL connector')
			Logger.info('Connected to Prisma [GraphQL] successfully')

			await this.emulator.start()
			await this.API.start()

		}

		catch (error) {
			Logger.error(error)
		}
	}

	private loadSocketEvents(socket: SocketIO.Socket, socketServer: SocketIO.Server) {

		//Event loader
		IO.readdirSync(path.join(__dirname, 'socket/events')).forEach((name) => {

			// socket.cyclone = {
			// 	username: 'Elizabeth',
			// 	figure: 'fa-201407-96.hr-85614122-37.ch-9142006-96-96.hd-787595-2.lg-5629782-96.sh-6298462-96.ha-1026-96.he-3358-71',
			// 	currentRoom: null
			// }

			//socket.on(<filename without extension>, callback)
			socket.on(/(.+)\.ts/i.exec(name)[1], (data: any) => {
				require(`./socket/events/${name}`).default(socket, data, socketServer)
				Logger.info(`Event executed from ${socket.id}: ${name}`)
			});
		});

		Logger.info(`New connection from ${socket.id}`)

		//this.enterRoom(Socket, this.roomId)


		// Socket.on('disconnect', () => {
		// 	this.disconnectPlayer(Socket, Socket.id)
		// })

		// Socket.on('requestRoom', (roomId: number) => {
		// 	this.requestRoom(Socket, roomId)
		// })

		// Socket.on('movePlayer', (destination: any) => {
		// 	this.movePlayer(
		// 		[
		// 			[0, 0, 0, 0, 0, 0, 0],
		// 			[0, 0, 0, 0, 0, 0, 0],
		// 			[0, 0, 0, 0, 0, 0, 0],
		// 			[0, 0, 0, 0, 1, 0, 0]
		// 		], Socket.id, destination)
		// })

		// Socket.on('tileClick', (mapTiles: any, destination: any) => {
		// 	this.movePlayer(Socket, mapTiles, player, destination)
		// })

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

		var playerId = Socket.id
		var player = this.players[playerId]

		Socket.emit('joinRoom', playerId, player.x, player.y)

		// var players = this.getAllPlayers()
		// console.log(players)

		// this.socketIO.sockets.emit('currentPlayers', players)

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
		Socket.broadcast.emit('playerDisconnected', Socket.id)
		Logger.info(`User ${Socket.id} disconnected`)
	}

	movePlayer(mapTiles: any, playerId: any, destination: any) {

		var player = this.players[playerId]

		var oldCoords = {
			x: player.x,
			y: player.y
		}

		if (player.x !== destination.x || player.y !== destination.y) {
			player.x = destination.x;
			player.y = destination.y;

			var grid = this.createMapGrid(mapTiles);
			var path = this.finder.findPath(oldCoords.x, oldCoords.y, player.x, player.y, grid);

			//this.socketIO.sockets.emit('playerMoved', playerId, oldCoords, path, destination)
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