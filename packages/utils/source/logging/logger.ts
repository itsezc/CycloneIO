import { transports, format, createLogger } from 'winston'
import { TransformableInfo } from 'logform'

const { combine, colorize, timestamp, printf } = format

const Logger = createLogger({
    format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        printf((info: TransformableInfo): string => {
            const { timestamp, level, message } = info
            return info.level, `${timestamp} ${level} - ${message}`
        })
    ),
    transports: [new transports.Console()]
})

export default Logger