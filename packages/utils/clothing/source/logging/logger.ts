import { transports, format, createLogger } from 'winston'

const { colorize, combine, timestamp, printf } = format

const Logger: any = createLogger({

	format: combine(
		colorize(),
		timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		printf((info: any): string => {
			const { timestamp, level, message } = info
			return info.level, `${timestamp} ${level} - ${message}`
		})
	),
	transports: [new transports.Console()]
})

export default Logger
