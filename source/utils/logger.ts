import { transports, format, createLogger, Logger } from 'winston'
const { combine, colorize, timestamp, printf } = format

export interface CycloneLogger extends Logger {
	server(alert: string): void,
	database(alert: string): void,
	network(alert: string): void,
	apollo(alert: string): void
}

const logger: any = createLogger({

	format: combine(

		timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),

		printf((info: any): string => {
			const { timestamp, level, message } = info

			var levelOutput

			switch (level) {
				case 'server':
					levelOutput = '[🌪 ]'
					break

				case 'database':
					levelOutput = '[🗄️ ]'
					break

				case 'apollo':
					levelOutput = '[⚛️ ]'
					break

				case 'network':
					levelOutput = '[⚙️]'
					break

				case 'error':
					levelOutput = '[❌ ]'
					break
			}

			const ts = timestamp.slice(0, 19).replace('T', ' ')
			return `${ts} ${levelOutput} - ${message}`
		})
	),
	level: 'ui',
	levels: {
		error: 0,
		info: 1,
		server: 2,
		network: 3,
		database: 4,
		apollo: 5,
		client: 6,
		ui: 7
	},
	transports: [new transports.Console()]
})

export default logger
