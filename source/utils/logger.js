import Winston, {
	transports,
	format,
	createLogger
} from 'winston'
const {
	combine,
	colorize,
	timestamp,
	printf
} = format

const Logger = createLogger({
	format: combine(
		colorize(),
		timestamp(),
		printf((info) => {
			const {
				timestamp,
				level,
				message,
				...args
			} = info

			const ts = timestamp.slice(0, 19).replace('T', ' ')
			return `${ts} [${level}] - ${message}`;
		}),
	),
	level: 'info',
	transports: [
		new transports.Console()
	]
})

export default Logger
