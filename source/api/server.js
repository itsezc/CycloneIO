import Chalk from 'chalk'
import Path from 'path'

import Hapi from 'hapi'
import Inert from 'inert'

import Orango, { EVENTS } from 'orango'

import Config from '../../config.json'

(async () => {

	// let DB = await Orango.connect({
	// 	url: String = 'http://45.76.33.252:8529',
	// 	username: String = Config.database.username,
	// 	password: String = Config.database.password
	// })
	// DB = Orango.get('cyclone')

	const Server = Hapi.server({
		host: 'localhost',
		port: 8080
	})

	await Server.register(Inert)

	Server.route({
		method: 'GET',
		path: '{param*}',
		handler: (request, h) => {
			return h.file(Path.join(__dirname, '../web/index.html'))
		}
	})

	Server.route({
		method: 'GET',
		path: '/web-build/{param*}',
		handler: {
		    directory: {
		        path: Path.join(__dirname, '../../web-build')
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
