// @flow
import IO from 'fs'
import Download from 'download'

import Config, { downloadURL } from './config.json'
import Logger from '../logger'
import Chalk from 'chalk'

import Path from 'path'

import { readFromBufferP, extractImages } from 'swf-extract'
import Spritesheet from 'spritesheet-js'

export default class Furniture {

	revision: number
	className: string

	/**
	 * @param {number} revision - 
	 * @param {string} className - 
	 */
	constructor(revision: number, className: string) {
		this.revision = revision
		this.className = className
	}

	async download(): Promise<Download> {

		try {

			var file = Path.join(__dirname, 'out', this.className, this.className.concat('.swf'))
			var url = downloadURL.concat(this.revision, '/', this.className, '.swf')
			var destination = Path.join(__dirname, 'out', this.className)

			Download(url, destination).then(data => {
				console.log('downloaded')
			})

/* 			await IO.access(file, IO.F_OK, error => {

				if (error) {

					Download(url, destination).then(data => {
						console.log('downloaded')
					})

				}

/* 				if (stats.isDirectory()) {
					console.log('directory')
				} */
/* 				if (!exists) {

					Download(url, destination).then(data => {
						console.log('downloaded')
					})

				} else {

					console.log('exists?')
				} 
			}) */

/* 
			var URLPath = downloadURL.concat(this.revision, '/', this.className, '.swf')

			await Download(URLPath).then(data => {

				this.extract(data)

			}) */

		}

		catch(error) {
			Logger.error(error)
		}
	}

	async extract(data: Buffer): Promise<void> {

		try {

			const swf = await readFromBufferP(data)
			const images = await Promise.all(extractImages(swf.tags))

			console.log(images)
/* 
			this.convert(images.imgData) */

		}

		catch(error) {
			Logger.error(error)
		}
	}

	async convert(data: Buffer) {

		try {

			console.log(data)
 
			Spritesheet(`out/${this.className}/*.png`, { format: 'json', name: this.className, path: `web-gallery/furniture/${this.className}` }, error => {

				if (error) {
					throw error
				}
			   
				console.log('spritesheet successfully generated')
			}) 

		}

		catch(error) {
			Logger.error(error)
		}
	}
}