import Config, { furnidataURL } from './config.json'

import IO from 'fs'

import Path from 'path'

import Chalk from 'chalk'

import Logger from '../logger'

import Parser from 'fast-xml-parser'

import Furniture from './furniture'

import Download from 'download'

import Format from 'xml-formatter'

export default class Furnidata 
{
	public constructor() 
	{
		this.access()
	}

	private access() 
	{
		var destination = Path.join(__dirname, 'out')
		var filePath = Path.join(destination, 'furnidata.xml')

		try
		{
			var exists = IO.existsSync(filePath)

			if (!exists)
			{
				this.download(filePath, destination)
			}

			else
			{
				var data = IO.readFileSync(filePath, { encoding: 'utf8'}) 

				this.download(filePath, destination, data, true)
			}
		}

		catch(error)
		{
			Logger.error(error)
		}
	}

	private download(filePath: string, destination: string, data?: string, exists = false): void
	{
		try
		{
			Download(furnidataURL).then((newData: Buffer) => 
			{	
				var options = { 
					collapseContent: true 
				}

				var newStringData = newData.toString()
				var formattedXML = Format(newStringData, options)

				if (!IO.existsSync(destination)) 
				{
					IO.mkdirSync(destination)
				}

				if (data && data !== formattedXML || !exists)
				{
					IO.writeFileSync(filePath, formattedXML, 'utf8')

					this.parse(newStringData)
				}
				
				else 
				{
					Logger.info(`Furnidata has no changes, everything is ${Chalk.green('up-to-date')}`)
				}
			})
		}

		catch (error)
		{
			Logger.error(error)
		}
	}

	private parse(data: string): void
	{
		try 
		{
			var options = { 
				attributeNamePrefix : '', 
				ignoreAttributes: false, 
				parseAttributeValue: true 
			}

			var furnidata = Parser.parse(data, options)

			if (furnidata) 
			{	
				furnidata.furnidata.roomitemtypes.furnitype.forEach((furniture: any) => 
				{
					new Furniture(furniture.revision, furniture.classname)
				})

				furnidata.furnidata.wallitemtypes.furnitype.forEach((furniture: any) => 
				{
					new Furniture(furniture.revision, furniture.classname)
				})
			}
		}

		catch(error) 
		{
			Logger.error(error)
		}
	}
}

const furnidata = new Furnidata()