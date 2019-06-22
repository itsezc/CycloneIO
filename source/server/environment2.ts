// import Config from '../../config.json'

// import Chalk from 'chalk'
// import Rainbow from 'chalk-animation'

// import ServerRegister from './network/server'

// //import RoomManager from './hotel/rooms/manager'
// import Logger, { CycloneLogger } from '../utils/logger'

// import { HttpLink as ApolloLink } from 'apollo-link-http'
// import { InMemoryCache as ApolloCache } from 'apollo-cache-inmemory'
// import { ApolloClient } from 'apollo-client'
// import { onError as ApolloError } from 'apollo-link-error'
// import gql from 'graphql-tag'

// /**
//  * Environment class
// */
// export default class Environment 
// {
// 	public _config: any
// 	public _logger: CycloneLogger
// 	public _server!: ServerRegister

// 	public static instance: Environment

// 	private database!: ApolloClient<any>

// 	//roomManager: RoomManager

// 	/**
// 	 * @param {JSON} config - The configuration file 
// 	*/
// 	public constructor(config: any)
// 	{

// 		this._logger = Logger

// 		if (!config)
// 		{
// 			this._logger.error('No configuration file found')
// 		} 
		
// 		else
// 		{
// 			this._config = config
// 			this.init()
// 		}
// 	}

// 	/**
//      * The main function
//      * Initialize the server
// 	*/
// 	public async init(): Promise<void>
// 	{
// 		try 
// 		{
// 			console.clear()
// 			Rainbow.rainbow('_________              .__                        ').render()
// 			Rainbow.rainbow('\\_   ___ \\___.__. ____ |  |   ____   ____   ____  ').render()
// 			Rainbow.rainbow('/    \\  \\<   |  |/ ___\\|  |  /  _ \\ /    \\_/ __ \\ ').render()
// 			Rainbow.rainbow('\\     \\___\\___  \\  \\___|  |_(  <_> )   |  \\  ___/ ').render()
// 			Rainbow.rainbow(' \\______  / ____|\\___  >____/\\____/|___|  /\\___  >').render()
// 			Rainbow.rainbow('        \\/\\/         \\/                 \\/     \\/ \n\n').render()

// 			console.log(`Version: ${Chalk.magenta.bold('1.0.0')} | License key : ${Chalk.magenta.bold(Config.license)}`)
// 			console.log(`Created by ${Chalk.red.bold('EZ-C 💖  Amor')}, ${Chalk.blue.bold('Sapphire')}, ${Chalk.bold('Kychloren')} of ${Chalk.yellow.bold('Habbay')}`)
// 			console.log(`Developers: ${Chalk.bold('ThePapaNoob')}, ${Chalk.bold('LeChris')} and ${Chalk.bold('TheGeneral')}`)
// 			console.log(`Contributors: ${Chalk.bold('ElBuffador')}, ${Chalk.bold('Droppy')} and ${Chalk.bold('Sonay')}`)
// 			console.log(`QA: ${Chalk.hex('#5042F4').bold('Platinum')} and ${Chalk.hex('#4B0082').bold('Layne')}\n`)

// 			this._server = await new Server(this._config)
// 			//this.roomManager = await new RoomManager() // I will add a Game Manager in the future.
// 		}

// 		catch (error) 
// 		{
// 			this._logger.error(error)
// 		}

// 		this.database = new ApolloClient({
// 			link: new ApolloLink({
// 				uri: 'http://localhost:8081/graphql'
// 			}),
// 			cache: new ApolloCache(),
// 			name: 'Database'
// 		})

// 		this.database.query({
// 			query:
// 				gql`
// 				{
// 					rooms(
// 						where: {
// 							currentUsers_gt: 0
// 						}
// 					) {
// 						id
// 						name
// 						maxUsers
// 						currentUsers
// 					}
// 				}
// 			`
// 		}).then((result: any) =>
// 		{
// 			console.log(result.data.rooms)
// 		})
// 			.catch((error: any) => console.error(error))
// 	}

// 	public get server(): ServerRegister
// 	{
// 		return this._server
// 	}
// }

// Environment.instance = new Environment(Config)