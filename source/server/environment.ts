import Config from '../../config.json'

import Chalk from 'chalk'
import Rainbow from 'chalk-animation'

import Server from './network/server'

//import RoomManager from './hotel/rooms/manager'
import Logger, { CycloneLogger } from '../utils/logger';

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
			console.clear()
			Rainbow.rainbow('_________              .__                        ').render()
			Rainbow.rainbow('\\_   ___ \\___.__. ____ |  |   ____   ____   ____  ').render()
			Rainbow.rainbow('/    \\  \\<   |  |/ ___\\|  |  /  _ \\ /    \\_/ __ \\ ').render()
			Rainbow.rainbow('\\     \\___\\___  \\  \\___|  |_(  <_> )   |  \\  ___/ ').render()
			Rainbow.rainbow(' \\______  / ____|\\___  >____/\\____/|___|  /\\___  >').render()
			Rainbow.rainbow('        \\/\\/         \\/                 \\/     \\/ \n\n').render()

			console.log(`Version: ${Chalk.magenta.bold('1.0.0')} | License key : ${Chalk.magenta.bold(Config.license)}`)
			console.log(`Created by ${Chalk.red.bold('EZ-C 💖  Amor')}, ${Chalk.blue.bold('Sapphire')}, ${Chalk.bold('Kychloren')} of ${Chalk.yellow.bold('Habbay')}`)
			console.log(`Developers: ${Chalk.bold('ThePapaNoob')}, ${Chalk.bold('LeChris')} and ${Chalk.bold('TheGeneral')}`)
			console.log(`Contributors: ${Chalk.bold('ElBuffador')}, ${Chalk.bold('Droppy')} and ${Chalk.bold('Ovflowd')}`)
			console.log(`QA: ${Chalk.hex('#5042F4').bold('Platinum')} and ${Chalk.hex('#4B0082').bold('Layne')}\n`)
			
			this._server = await new Server(this._config)
			//this.roomManager = await new RoomManager() // I will add a Game Manager in the future.
		} 
		
		catch (error) 
		{
			this._logger.error(error)
		}
	}

	public get server(): Server {
		return this._server
	}
}

Environment.instance = new Environment(Config)
