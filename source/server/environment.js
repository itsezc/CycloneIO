import Hapi from 'hapi'
import Inert from 'inert'
import Socket from 'socket.io'
import Path from 'path'
import readline from 'readline'

import Log from './utilities/log'
import { CONNECTION, SHUTDOWN } from '../common/constants/server'
import Player from './hotel/rooms/player'
import { DISCONNECT } from '../common/constants/actions/player'
import { pathToFileURL } from 'url';
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
        await server.register(Inert)
		server.route({
			method: 'GET',
			path: '/client/js/core/hotel.js',
			handler: (request, h) => {
				return h.file('./client.js')
			}
		})
		server.route({
			method: 'GET',
			path: '/client/css/hotel.css',
			handler: (request, h) => {
				return h.file('./hotel.css')
			}
		})
		server.route({
			method: 'GET',
			path: '/client/images/grid_purse/diamond_icon.png',
			handler: (request, h) => {
				return h.file('./images/grid_purse/diamond_icon.png')
			}
		})
		server.route({
			method: 'GET',
			path: '/client/images/toolbar/inventory_button.png',
			handler: (request, h) => {
				return h.file('./images/toolbar/inventory_button.png')
			}
		})
		server.route({
			method: 'GET',
			path: '/client/images/toolbar/left_arrow_button.png',
			handler: (request, h) => {
				return h.file('./images/toolbar/left_arrow_button.png')
			}
		})
		server.route({
			method: 'GET',
			path: '/client/images/toolbar/hotel_view_button.png',
			handler: (request, h) => {
				return h.file('./images/toolbar/hotel_view_button.png')
			}
		})
		server.route({
			method: 'GET',
			path: '/client/images/toolbar/navigator_button.png',
			handler: (request, h) => {
				return h.file('./images/toolbar/navigator_button.png')
			}
		})
		server.route({
			method: 'GET',
			path: '/client/images/toolbar/shop_button.png',
			handler: (request, h) => {
				return h.file('./images/toolbar/shop_button.png')
			}
		})
		server.route({
			method: 'GET',
			path: '/client/images/toolbar/bubble_chat_bar.png',
			handler: (request, h) => {
				return h.file('./images/toolbar/bubble_chat_bar.png')
			}
		})
		server.route({
			method: 'GET',
			path: '/client/images/toolbar/chat_bar_long.png',
			handler: (request, h) => {
				return h.file('./images/toolbar/chat_bar_long.png')
			}
		})
		server.route({
			method: 'GET',
			path: '/client/images/toolbar/camera_button.png',
			handler: (request, h) => {
				return h.file('./images/toolbar/camera_button.png')
			}
		})
		server.route({
			method: 'GET',
			path: '/client/images/toolbar/search_friends_button.png',
			handler: (request, h) => {
				return h.file('./images/toolbar/search_friends_button.png')
			}
		})
		server.route({
			method: 'GET',
			path: '/client/images/toolbar/help_chat_bar_button.png',
			handler: (request, h) => {
				return h.file('./web-build/images/toolbar/help_chat_bar_button.png')
			}
		})
		server.route({
			method: 'GET',
			path: '/client/images/toolbar/right_arrow_button1.png',
			handler: (request, h) => {
				return h.file('./images/toolbar/right_arrow_button1.png')
			}
		})
		server.route({
			method: 'GET',
			path: '/web-build/sprites/player.png',
			handler: (request, h) => {
				return h.file('./sprites/player.png')
			}
		})
		server.route({
			method: 'GET',
			path: '/web-build/images/tile.png',
			handler: (request, h) => {
				return h.file('./images/tile.png')
			}
		})
		server.route({
			method: 'GET',
			path: '/hotel',
			handler: (request, h) => {
				return h.file('../web/hotel.html')
			}
		})
        await server.start()
    }

    catch (err) {
        Log.getLogger().error(err);
        process.exit(1);
    }

    Log.getLogger().info(`Server running on port ${port}`);
};

start();

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
