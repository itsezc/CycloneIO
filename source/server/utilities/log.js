import log4js from 'log4js'

class Log {
	static getLogger() {
		log4js.configure({
			appenders: {
				out: {
					type: 'stdout',
					layout: {
						type: 'pattern',
						pattern: '%[[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p] -%] %m',
					},
				},
			},
			categories: {
				default: {
					appenders: ['out'],
					level: 'debug'
				}
			}
		})
		return log4js.getLogger()
	}
}

export default Log