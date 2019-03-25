import Logger from '../utils/logger'

import Constants from './constants.json'

import WebSocket from 'socket.io'

import Hapi from 'hapi'
import Inert from 'inert'
import Routes from './http/routes'

import RoomPlayer from '../core/rooms/player'

class Server {

	constructor() {

		this.players = 0

		this.HTTP = new Hapi.Server({
			port: 8081
		})

		this.SocketIO = new WebSocket(this.HTTP.listener)

		this.SocketIO.on(Constants.common.server.CONNECTION, (Socket) => {
			new RoomPlayer(this.SocketIO, Socket)
			Logger.info('New connection : ' + Socket.id)
			this.players++

			Socket.on(Constants.common.actions.player.DISCONNECT, () => {
				RoomPlayer.onDisconnect(this.SocketIO, Socket)
				Logger.info('Disconnection : ' + Socket.id)
				this.players--
			})
		})

		this.Start()
	}

	async Start() {
		try {
			await this.HTTP.register(Inert)
			await this.HTTP.route(Routes)
			await this.HTTP.start()
		} catch (error) {
			Logger.error(error)
			process.exit(1)
		}

		Logger.info(`Server running on port ${this.HTTP.info.port}`)
	}

	Shutdown() {
		this.SocketIO.emit('disconnectAllPlayers')
		this.HTTP.stop({
			timeout: 100000
		}).then((error) => {
			Logger.info('Server gracefully stopped')
		})
	}

}

export { Server as default }
