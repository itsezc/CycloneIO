import Chalk from 'chalk'
import Path from 'path'

import Hapi from 'hapi'
import Inert from 'inert'

import Orango, { EVENTS } from 'orango'

import Config from '../../config.json'


(async () => {


	const Server = Hapi.server({
		host: 'localhost',
		port: 8080
	})

	await Server.register(Inert)

	Server.route({
		method: 'GET',
		path: '/{param*}',
		handler: (request, h) => {
			console.log(Path.join(__dirname, '../structure.html'))
			return h.file(Path.join(__dirname, '../structure.html'))
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
