// @flow

import Config from '../../config.json'

import Chalk from 'chalk'
import ReadLineSync from 'readline-sync'

import Logger from './utils/logger'
import Server from './network/server'

import RoomManager from './hotel/rooms/manager'

/**
 * Environment class
 */
export default class Environment {

	config: JSON
	logger: Logger
	server: Server
	//roomManager: RoomManager

	/**
	 * @param {JSON} config - The configuration file 
	 */
	constructor(config: JSON): void {

		this.config = config
		console.clear()
		
		console.log(Chalk.bold.blue('_________              .__                        '))
		console.log(Chalk.bold.blue('\\_   ___ \\___.__. ____ |  |   ____   ____   ____  '))
		console.log(Chalk.bold.blue('/    \\  \\<   |  |/ ___\\|  |  /  _ \\ /    \\_/ __ \\ '))
		console.log(Chalk.bold.blue('\\     \\___\\___  \\  \\___|  |_(  <_> )   |  \\  ___/ '))
		console.log(Chalk.bold.blue(' \\______  / ____|\\___  >____/\\____/|___|  /\\___  >'))
		console.log(Chalk.bold.blue('        \\/\\/         \\/                 \\/     \\/ \n\n'))

		console.log(`Version: ${Chalk.magenta.bold(Config.version)} | License key : ${Chalk.magenta.bold(Config.license)}`)
		console.log(`Created by ${Chalk.red.bold('EZ-C 💖  Amor')} and ${Chalk.blue.bold('Sapphire')} of ${Chalk.yellow.bold('Habbay')}`)
		console.log(`Contributors: ${Chalk.bold('Kychloren')} and ${Chalk.bold('LeChris')}`)
		console.log(`QA: ${Chalk.hex('#5042F4').bold('Platinum')} and ${Chalk.hex('#4B0082').bold('Layne')}\n`)

		this.init()
	}

	/**
     * The main function
     * Initialize the server
     */
	async init(): Promise<void> {

		try {

			this.logger = await Logger
			this.server = await new Server(this.config)
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

Environment.instance = new Environment(Config)

export const logger = Logger