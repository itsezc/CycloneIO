import Config from '../../config.json'

import Chalk from 'chalk'

import Logger, {CycloneLogger} from './utils/logger'
import Server from './network/server'

//import RoomManager from './hotel/rooms/manager'

/**
 * Environment class
*/
export default class Environment 
{
	
	public _config: any
	public _logger: CycloneLogger
	public _server!: Server

	public static instance: Environment
	//roomManager: RoomManager

	/**
	 * @param {JSON} config - The configuration file 
	 */
	public constructor(config: any)
	{

		this._logger = Logger
		this._config = config

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
	public async init(): Promise<void>
	{
		try 
		{
			this._server = await new Server(this._config)
			//this.roomManager = await new RoomManager() // I will add a Game Manager in the future.
		} 
		
		catch (error) 
		{
			this._logger.error(error)
		}
	}
}

Environment.instance = new Environment(Config)
