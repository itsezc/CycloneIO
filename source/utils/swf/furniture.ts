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

	private destination!: string

	/**
	 * @param {number} revision - 
	 * @param {string} className - 
	 */
	constructor(revision: number, className: string) 
	{
		this.revision = revision
		this.className = className.replace('*', '_')

		this.download()
	}

	private sleep(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms))
	}


	private download(): void
	{
		try 
		{
			var destination = Path.join(__dirname, 'out', this.className)
			var filePath = Path.join(destination, this.className.concat('.swf'))
			var URLPath = downloadURL.concat(this.revision.toString(), '/', this.className, '.swf')

			var exists = IO.existsSync(destination)

			if (!exists)
			{
				IO.mkdirSync(destination, { recursive: true })

				console.log('adding folder')
				setTimeout(() => {
					console.log('added folder')
				}, 2000)
				
				//wait 2 seconds 
				//Download(URLPath)
			}
		}

		catch(error) 
		{
			Logger.error(error)
		}
	}

	private async extract(data: Buffer): Promise<void> 
	{
		try 
		{
			/* const swf = await readFromBufferP(data)
			const images = await Promise.all(extractImages(swf.tags))

			images.forEach(async (image: any, index: number) => 
			{
				var file = Path.join(this.destination, 'images', this.className.concat('_', index.toString(), '.png'))
 */
				/* await IO.access(file, IO.constants.F_OK, async (error) => 
				{
					if (error) 
					{
						try 
						{
							await IO.writeFile(file, image.imgData, (error) => 
							{
								if (error)
								{
									throw error
								}
							})
						}

						catch(error)
						{
							throw error
						}
					}
				}) */
/* 			}) */
		}

		catch(error) 
		{
			Logger.error(error)
		}
	}

	async convert(data: Buffer) {

		try {

			console.log(data)
 
			Spritesheet(`out/${this.className}/*.png`, { format: 'json', name: this.className, path: `web-gallery/furniture/${this.className}` }, error => {

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