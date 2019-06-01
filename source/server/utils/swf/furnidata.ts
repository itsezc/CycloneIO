import { furnidataURL } from './config.json'
import Logger from '../logger'
import Parser from 'fast-xml-parser'
import Furniture from './furniture'
import Download from 'download'
import sleep from '../sleep'

export default class Furnidata {

	private furniture!: Furniture

	public constructor() 
	{
		this.download()
	}

	public async download(): Promise<void> 
	{

		try 
		{
			await Download(furnidataURL).then((data: Buffer) => {
				this.parse(data.toString())
			})
		}

		catch(error) 
		{
			Logger.error(error)
		}
	}

	public async parse(data: string): Promise<void> {

		try {

			var furnidata = await Parser.parse(data, { 
				attributeNamePrefix : '', 
				ignoreAttributes: false, 
				parseAttributeValue: true 
			})

			if (furnidata) {
				
				furnidata.furnidata.roomitemtypes.furnitype.forEach((furniture: any) => {
					this.downloadFurniture(furniture.revision, furniture.classname)
				})

				furnidata.furnidata.wallitemtypes.furnitype.forEach((furniture: any) => {
					this.downloadFurniture(furniture.revision, furniture.classname)
				})
			}
		}

		catch(error) {
			Logger.error(error)
		}
	}

	public async downloadFurniture(revision: number, className: string): Promise<void> {

		try {

			this.furniture = await new Furniture(revision, className)

			await this.furniture
			await this.furniture.download()

			await sleep(1000)
		}

		catch(error) {
			Logger.error(error)
		}
	}
}
