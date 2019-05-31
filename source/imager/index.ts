import * as Hapi from 'hapi'

const Server: Hapi.Server = new Hapi.Server({
	port: 8084
})

Server.route({
	method: 'GET',
	path: '/',
	
})