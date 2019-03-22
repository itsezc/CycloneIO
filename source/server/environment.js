import Hapi from 'hapi'
import Socket from 'socket.io'
import Path from 'path'
import readline from 'readline'

import Log from './utilities/log'
import { CONNECTION, SHUTDOWN } from '../common/constants/server'
import Player from './hotel/rooms/player'
import { DISCONNECT } from '../common/constants/actions/player'
import { pathToFileURL } from 'url'
const port = process.env.PORT || 90
const server = new Hapi.Server({
	port
})
const SocketIO = Socket(server.listener)

SocketIO.on(CONNECTION, (socket) => {
	Player.onConnect(SocketIO, socket)

	socket.on(DISCONNECT, function () {
		Player.onDisconnect(SocketIO, socket)
	})
})

const start = async function () {
	try {
		await server.start()
	} catch (err) {
		Log.getLogger().error(err)
		process.exit(1)
	}

	Log.getLogger().info(`Server running on port ${port}`)
}

start()

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdouts
})

rl.setPrompt('> ')
rl.prompt()

rl.on('line', (line) => {
	if (line.startsWith('/')) {
		switch (line) {
		case '/clear':
			console.clear()
			break

		case '/shutdown':
			Log.getLogger().info('Server shutted down.')
			SocketIO.sockets.emit(SHUTDOWN)
			process.exit(0)
			break

		case '/test':
			console.log('Test')
			break

		default:
			Log.getLogger().error(`${line} is an unnamed command.`.substr(1))
			break
		}

		rl.prompt()
	}

	else if (line) {
		Log.getLogger().error('Please specify a command to execute.')
		rl.prompt()
	}
}).on('close', () => {
	process.exit(0)
})
