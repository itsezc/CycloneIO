import Winston, { transports, format, createLogger } from 'winston'
const { combine, timestamp, label, printf } = format

const printFormat = printf(({ level, message, label, timestamp }) => {
	// return `[${timestamp}]${label}${message}`
	return `[${timestamp}]${label}${message}`
})

const Logger = createLogger({
	format: combine(
		label({ label: '[🌪️ ] => ' }),
		timestamp(),
		printFormat
	),
	level: 'info',
	transports: [
		new transports.Console()
	]
})

export default Logger
