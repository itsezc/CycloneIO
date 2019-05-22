// @flow
import IO from 'fs'
import Download from 'download'

import Config, { downloadURL, downloadDirectory } from './config.json'
import Logger from '../../logger'
import Chalk from 'chalk'

import Parser from 'fast-xml-parser'
import Path from 'path'

export default class FurnitureDownloader {

	/*
		Download XML file
		Convert to JSON
		Parse the JSON file
		Download all the SWFs
		Extract each SWF image and generate spritesheet image and JSON
	*/

	revision: number
	className: string
	furnidata: Parser

	// XML file to JSON -> fast-xml-parser

	constructor(revision: number, className: string) {
		this.revision = revision
		this.className = className

		//this.run()
	}

	async run() {

		try {

			var URLPath = `${downloadURL}/${this.revision}/${this.className}.swf`
			var localPath = Path.join(__dirname, downloadDirectory)
			var localFilePath = Path.join(localPath, this.className.concat('.swf'))

			await IO.exists(localFilePath, exists => {

				if (exists) {
					Logger.info(`${Chalk.red(this.className.concat('.swf'))} already exist and it's being ignored`)
					
				} else {

					Download(URLPath, localPath).then(data => {
						Logger.info(`Downloaded ${Chalk.red(this.className.concat('.swf'))} from ${Chalk.green(URLPath)}`)

					}).catch(error => {
						Logger.error(error)
					})

				}
			})

			// this.furnidata = await Parser.parse(Config.furnidataURL)

			// await this.furnidata

			// console.log(this.furnidata)

		} catch(error) {
			Logger.error(error)
		}
		
	}

	downloadXML() {

	}
}