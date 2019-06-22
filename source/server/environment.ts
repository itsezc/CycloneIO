// import Chalk from 'chalk'
import ChalkAnimation from 'chalk-animation'

import CycloneConfig from '../common/types/config'
import Config from '../../config.new.json'

import Logger, { LoggerTypeMessage } from '../utils/logger'

import Server from './network/server'

class Environment
{
	private readonly logger: LoggerTypeMessage
	private server: Server

	constructor(private readonly config: CycloneConfig)
	{
		this.logger = Logger

		if (!this.config)
		{
			this.logger.error('No configuration file found')
		}

		else
		{
			this.init()
		}
	}

	private async init(): Promise<void>
	{
		console.clear()

		ChalkAnimation.rainbow('_________              .__                        ').render()
		ChalkAnimation.rainbow('\\_   ___ \\___.__. ____ |  |   ____   ____   ____  ').render()
		ChalkAnimation.rainbow('/    \\  \\<   |  |/ ___\\|  |  /  _ \\ /    \\_/ __ \\ ').render()
		ChalkAnimation.rainbow('\\     \\___\\___  \\  \\___|  |_(  <_> )   |  \\  ___/ ').render()
		ChalkAnimation.rainbow(' \\______  / ____|\\___  >____/\\____/|___|  /\\___  >').render()
		ChalkAnimation.rainbow('        \\/\\/         \\/                 \\/     \\/ \n\n').render()

		try
		{
			this.server = await new Server(this.config)
		}

		catch (error)
		{
			this.logger.error(error)
		}
	}

	/*
		console.log(`Version: ${Chalk.magenta.bold('1.0.0')} | License key : ${Chalk.magenta.bold(Config.license)}`)
		console.log(`Created by ${Chalk.red.bold('EZ-C 💖  Amor')}, ${Chalk.blue.bold('Sapphire')}, ${Chalk.bold('Kychloren')} of ${Chalk.yellow.bold('Habbay')}`)
		console.log(`Developers: ${Chalk.bold('ThePapaNoob')}, ${Chalk.bold('LeChris')} and ${Chalk.bold('TheGeneral')}`)
		console.log(`Contributors: ${Chalk.bold('ElBuffador')}, ${Chalk.bold('Droppy')} and ${Chalk.bold('Sonay')}`)
		console.log(`QA: ${Chalk.hex('#5042F4').bold('Platinum')} and ${Chalk.hex('#4B0082').bold('Layne')}\n`) 
	*/
}

new Environment(Config)