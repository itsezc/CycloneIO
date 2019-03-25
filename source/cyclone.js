import Chalk from 'chalk'
import Readline from 'readline'

import Logger from './utils/logger'
import Server from './network/server'

import Config from '../config.json'

const log = console.log

class Cyclone {

	constructor() {

		console.clear()

		log(Chalk.bold.blue('_________              .__                        '))
		log(Chalk.bold.blue('\\_   ___ \\___.__. ____ |  |   ____   ____   ____  '))
		log(Chalk.bold.blue('/    \\  \\<   |  |/ ___\\|  |  /  _ \\ /    \\_/ __ \\ '))
		log(Chalk.bold.blue('\\     \\___\\___  \\  \\___|  |_(  <_> )   |  \\  ___/ '))
		log(Chalk.bold.blue(' \\______  / ____|\\___  >____/\\____/|___|  /\\___  >'))
		log(Chalk.bold.blue('        \\/\\/         \\/                 \\/     \\/ '))
		log(`Version: ${Chalk.magenta.bold('1.0.0')} | License key : ${Chalk.magenta.bold(Config.license)}`)
		log(`Created by ${Chalk.red.bold('EZ-C 💖 Amor')}, ${Chalk.blue.bold('Sapphire')} and ${Chalk.green.bold('Rebel')} of ${Chalk.yellow.bold('Habbay')}`)
		Logger.info('Starting Cyclone ... ')

		this.init()

	}

	async init() {
		try {
			this.Server = new Server()

			this.rl = Readline.createInterface({
				input: process.stdin,
				output: process.stdout
			})

			this.rl.setPrompt('[🌪️ ] => ')
			this.rl.on('line', (line) => {
				if(line.startsWith('/')) {
					switch (line) {
						case '/stats':
							this.getPlayers = this.Server.players
							Logger.info('There are currently ' + this.getPlayers + ' players')
							break

						case '/clear':
							console.clear()
							break

						case '/shutdown':
							Logger.info('Shutting down...')
							if(this.Server) {
								this.Server.Shutdown()
								process.exit(0)
							}
							break

						default:
							Logger.info(`${line} is an unnamed command`)
					}
					this.rl.prompt()
				}
			})
			this.rl.prompt()
		} catch (error) {
			Logger.info(error)
		}
	}

	quit() {
		Logger.info('Shutting down Cyclone ... ')
		process.exit()
	}

}

let App = new Cyclone()
