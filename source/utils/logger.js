import Chalk from 'chalk'
import Winston, { transports, format, createLogger } from 'winston'
const { combine, colorize, timestamp, printf } = format

const Logger = createLogger({
    format: combine(
        timestamp(),
        printf(info => {
            const { timestamp, level, message, ...args } = info

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
                    levelOutput = '[⚙️ ]'
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

export default Logger
