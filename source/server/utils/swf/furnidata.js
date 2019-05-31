// @flow
import IO from 'fs'

import Config, { furnidataURL } from './config.json'

import Path from 'path'

import Logger from '../logger'

import Parser from 'fast-xml-parser'

import Furniture from './furniture'

import Download from 'download'

import sleep from '../sleep'

export default class Furnidata {

	furniture: Furniture
	data: JSON

	constructor(): void {
		this.download()
	}

	async download(): Promise<Download> {

		try {

			await Download(furnidataURL, { encoding: 'utf8' }).then(data => {
				this.parse(data)
			})

		}

		catch(error) {
			Logger.error(error)
		}

	}

	async parse(data: string): Promise<void> {

		try {

			var furnidata = await Parser.parse(data, { 
				attributeNamePrefix : '', 
				ignoreAttributes: false, 
				parseAttributeValue: true 
			})

			if (furnidata) {
				
				furnidata.furnidata.roomitemtypes.furnitype.forEach(furniture => {

					this.downloadFurniture(furniture.revision, furniture.classname)

				})

				furnidata.furnidata.wallitemtypes.furnitype.forEach(furniture => {

					this.downloadFurniture(furniture.revision, furniture.classname)

				})

			}
		}

		catch(error) {
			Logger.error(error)
		}
	}

	async downloadFurniture(revision: number, className: string) {

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

const furnidata = new Furnidata()