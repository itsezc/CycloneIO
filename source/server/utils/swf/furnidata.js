// @flow
import IO from 'fs'

import Config, { furnidataURL } from './config.json'

import Path from 'path'

import Logger from '../logger'

import Parser from 'fast-xml-parser'

import Furniture from './furniture'

import Download from 'download'

import Format from 'xml-formatter'

import Delay from 'delay'

//import sleep from '../sleep'

export default class Furnidata {

	furniture: Furniture
	data: JSON

	constructor(): void {
		this.download()
	}

	async download(): Promise<Download> {

		try {
			
			const destination = Path.join(__dirname, 'out', 'gamedata')
			const file = Path.join(destination, 'furnidata.xml')

			await Download(furnidataURL, destination, { encoding: 'utf8' }).then(data => {

				var options = { 
					collapseContent: true 
				}

				var formattedXML = Format(data, options)

				IO.writeFile(file, formattedXML, 'utf8', (error) => {

					if (error) {
						throw error
					}

					this.parse(data)

				})

			})

		}

		catch(error) {
			Logger.error(error)
		}
	}

	async parse(data: string): Promise<void> {

		try {

			var options = { 
				attributeNamePrefix : '', 
				ignoreAttributes: false, 
				parseAttributeValue: true 
			}

			var furnidata = await Parser.parse(data, options)

			if (furnidata) {
				
				furnidata.furnidata.roomitemtypes.furnitype.forEach(furniture => {

					this.downloadFurni(furniture.revision, furniture.classname)

				})

				furnidata.furnidata.wallitemtypes.furnitype.forEach(furniture => {

					this.downloadFurni(furniture.revision, furniture.classname)

				})

			}
		}

		catch(error) {
			Logger.error(error)
		}
	}

	async downloadFurni(revision: number, className: string) {

		try {

			this.furniture = await new Furniture(revision, className)

			await this.furniture
			await this.furniture.download()

			await Delay(1000)

		}

		catch(error) {
			Logger.error(error)
		}

	}
}

const furnidata = new Furnidata()