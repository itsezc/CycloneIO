
const Routes = [{
	method: 'GET',
	path: '/{param*}',
	handler: (request: any, h: any) =>
	{
		return h.file('./web-gallery/dist/index.html')
	}

	},
	{
		method: 'GET',
		path: '/web-gallery/{param*}',
		handler: {
			directory: {
				path: './web-gallery/',
				listing: true
			}
		}
	},
]

export default Routes
