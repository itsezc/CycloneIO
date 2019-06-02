const Routes = [{
		method: 'GET',
		path: '/{param*}',
		handler: (request: any, h: any) => {
			return h.file('./web-build/dist/index.html')
		}
	},
	{
		method: 'GET',
		path: '/web-build/{param*}',
		handler: {
			directory: {
				path: './web-build/',
				listing: true
			}
		}
	},
	{
		method: 'GET',
		path: '/housekeeping/{param*}',
		handler: (request: any, h: any) => {
			return h.file('./web-build/dist/housekeeping.html')
		}
	}
]

export default Routes
