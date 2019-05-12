// @flow
import Chalk from 'chalk'
import ReadLineSync from 'readline-sync'

import Logger from './utils/logger'
import Server from './network/server'

import RoomManager from './core/hotel/rooms/manager'

import Config from '../config.json'

export default class Environment {
	logger: Logger
	server: Server
	//roomManager: RoomManager

	constructor() {
		console.clear()
		
		console.log(Chalk.bold.blue('_________              .__                        '))
		console.log(Chalk.bold.blue('\\_   ___ \\___.__. ____ |  |   ____   ____   ____  '))
		console.log(Chalk.bold.blue('/    \\  \\<   |  |/ ___\\|  |  /  _ \\ /    \\_/ __ \\ '))
		console.log(Chalk.bold.blue('\\     \\___\\___  \\  \\___|  |_(  <_> )   |  \\  ___/ '))
		console.log(Chalk.bold.blue(' \\______  / ____|\\___  >____/\\____/|___|  /\\___  >'))
		console.log(Chalk.bold.blue('        \\/\\/         \\/                 \\/     \\/ \n\n'))

		console.log(`Version: ${Chalk.magenta.bold(Config.version)} | License key : ${Chalk.magenta.bold(Config.license)}`)
		console.log(`Created by ${Chalk.red.bold('EZ-C 💖  Amor')} and ${Chalk.blue.bold('Sapphire')} of ${Chalk.yellow.bold('Habbay')}`)
		console.log(`Contributors: ${Chalk.bold('Kychloren')}, ${Chalk.bold('Blidnight')}, ${Chalk.bold('ElBouffador')} and ${Chalk.bold('LeChris')}`)
		console.log(`QA: ${Chalk.hex('#5042F4').bold('Platinum')} and ${Chalk.hex('#4B0082').bold('Layne')}\n`)

		this.init()
	}

	async init() {
		try {
			this.logger = await Logger
			this.server = await new Server({
				mode: 'development'
			})
			//this.roomManager = await new RoomManager() // I will add a Game Manager in the future.

			// ReadLineSync.promptLoop((command) => {
			//   console.log('-- You said "' + command + '"');
			// }, {
			// 	limit: '1-6'
			// })

		} catch (error) {
			this.logger.error(error)
		}
	}

	static instance: Environment
}

Environment.instance = new Environment()
