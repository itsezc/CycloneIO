import Hapi from 'hapi'
import Inert from 'inert'
import Path from 'path'
import Config from '../../../Config.json'

(async() => {

	const Server = new Hapi.Server({ port: 8080 })

	const theme = Config.hotel.theme
	const language = Config.hotel.language

	await Server.register(Inert)

	Server.route({
		method: 'GET',
	    path: '/web-build/{path*}',
	    handler: {
	        directory: {
	            path: Path.join(__dirname, '../../../web-build'),
	            listing: true,
				index: true
	        }
	    }
	})

	try {
		await Server.start()
	} catch (error) {
		throw error
		process.exit(1)
	}

	console.log('Server started')

})()
