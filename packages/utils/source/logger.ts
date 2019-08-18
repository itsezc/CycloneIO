import { Logger, transports, format, createLogger } from 'winston'

const { colorize, combine, timestamp, printf } = format

const Logger = createLogger({
    format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        printf((info: any): string => {
            return info.level, `${info.timestamp} ${info.level} - ${info.message}`
        })
    ),
    transports: [new transports.Console()]
})

export default Logger