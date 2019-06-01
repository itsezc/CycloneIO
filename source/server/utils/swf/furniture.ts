import IO from 'fs'
import Download from 'download'

import Config, { downloadURL } from './config.json'
import Logger from '../logger'
import Chalk from 'chalk'

import Path from 'path'

import { readFromBufferP, extractImages } from 'swf-extract'
import Spritesheet from 'spritesheet-js'

export default class Furniture {

	private revision: number
	private className: string

	/**
	 * @param {number} revision - 
	 * @param {string} className - 
	 */
	constructor(revision: number, className: string) 
	{
		this.revision = revision
		this.className = className
	}

	async download(): Promise<void> 
	{

		try 
		{
			var URLPath = downloadURL.concat(this.revision.toString(), '/', this.className, '.swf')

			await Download(URLPath, 'out').then(data => {
				//this.extract(data)
			})
		}

		catch(error) 
		{
			Logger.error(error)
		}
	}

	async extract(data: Buffer): Promise<void> {

		try 
		{
			const swf = await readFromBufferP(data)
			const images = await Promise.all(extractImages(swf.tags))

			this.convert()
		}

		catch(error) {
			Logger.error(error)
		}
	}

	async convert() 
	{
		try 
		{
			Spritesheet('assets/*.png', { format: 'json' }, (error: any) => {

				if (error) 
				{
					throw error
				}
			   
				console.log('spritesheet successfully generated')
			})
		}

		catch(error) 
		{
			Logger.error(error)
		}
	}
}