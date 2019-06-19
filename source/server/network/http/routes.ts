import TileImager from '../../../imager/tile' 

const Routes = [{
		method: 'GET',
		path: '/{param*}',
		handler: (request: any, h: any) => {
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
	{
		method: 'GET',
		path: '/housekeeping/{param*}',
		handler: (request: any, h: any) => {
			return h.file('./web-gallery/dist/housekeeping.html')
		}
	},
	{
		method: 'GET',
		path: '/imaging/tile',
		handler: TileImager.requestHandler
	}
]

export default Routes
