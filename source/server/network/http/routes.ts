import TileImager from '../../../imager/tile' 

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
	},
	{
		method: 'GET',
		path: '/imaging/tile',
		handler: TileImager.requestHandler
	},
	{
		method: 'GET',
		path: '/imaging/figure/{figure}/{gesture}/{direction}/{frame}',
		handler: {
			proxy: {
				uri: 'http://www.habbo.com/habbo-imaging/avatarimage?figure={figure}&headonly=0&direction={direction}&head_direction={direction}&action={gesture}&gesture={gesture}&size=m&frame={frame}'
			}
		}
	}
]

export default Routes
