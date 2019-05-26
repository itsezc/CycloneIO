// @flow
import IO from 'fs'

import Config, { furnidataURL, furnidataName } from './config.json'

import Path from 'path'
import Download from 'download'

import Logger from '../../logger'

import Parser from 'fast-xml-parser'

import Furniture from './furniture'

export default class FurniData {

	furniture: Furniture

	constructor(): void {
		this.download()
	}

	async download(): Promise<void> {

		try {

			var URLPath = furnidataURL.concat('/', furnidataName)
			var localPath = Path.join(__dirname, 'out')
			var localFilePath = Path.join(localPath, furnidataName.concat('.xml'))

			await IO.exists(localFilePath, exists => {

				if (!exists) {

					Download(URLPath, localPath, { encoding: 'utf8' }).then(data => {
						this.parse(data)

					}).catch(error => {
						throw error
					})

				} else {

					IO.readFile(localFilePath, 'utf8', (error, data) => {

						if(error) {
							throw error
						}
						
						this.parse(data)	

					})
				}

			})

		} catch(error) {
			Logger.error(error)
		}

	}

	async parse(data: string): Promise<void> {

		try {

			var furniData = await Parser.parse(data, { 
				attributeNamePrefix : '', 
				ignoreAttributes: false, 
				parseAttributeValue: true 
			})

			if (furniData !== undefined) {

				furniData.furnidata.roomitemtypes.furnitype.forEach(item => {
					
					this.furniture = new Furniture(item.revision, item.classname)
					// sleep(20000)

				})

				// for (var item in furniData.roomwallitems) {
					
				// }
			}
		}

		catch(error) {
			Logger.error(error)
		}
	}
}

let furniData = new FurniData()