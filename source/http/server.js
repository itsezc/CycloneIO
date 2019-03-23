import Chalk from 'chalk'
import Path from 'path'

import Hapi from 'hapi'
import Inert from 'inert'

import Orango, { EVENTS } from 'orango'

import Config from '../../config.json'



(async () => {
	console.log('Testing Jason')

	const Server = Hapi.server({
		host: 'localhost',
		port: 8080,
		routes: {
			files: {
				relativeTo: Path.join(__dirname, '../../dist')
			}
		}
	})

	await Server.register(Inert)

	Server.route({
		method: 'GET',
		path: '/{param*}',
		handler: (request, h) => {
			//console.log(Path.join(__dirname, './structure.html'))
			return h.file('./structure.html')
		}
	})

	Server.route({
		method: 'GET',
		path: '/web-build/{param*}',
		handler: {
			directory: {
				path: Path.join(__dirname, '../../web-build'),
				listing: true
			}
		}
	})

	try {
		await Server.start()
	} catch (error) {
		console.log(error)
		process.exit(1)
	}

	console.log('Server running at:', Server.info.uri)

})()
