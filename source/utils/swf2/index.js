import Config from './config.json'
import Path from 'path'
import IO from 'fs'

import Parser from 'fast-xml-parser'
import Format from 'xml-formatter'
import Download from 'download'
import { extractImages } from 'swf-extract';

class SWF { 
	
	constructor() {

		this.XMLOptions = { 
			collapseContent: true 
		}

		this.JSONOptions = {
			attributeNamePrefix : '', 
			ignoreAttributes: false, 
			parseAttributeValue: true 
		}

		this.output = Path.join(__dirname, 'out')
		this.localFurniDataPath = Path.join(__dirname, 'furnidata.xml')
		this.localFurniDataJSONPath = Path.join(__dirname, 'furnidata.json')

		this.downloadQueue = []

		console.log('Cyclone HTML5 Furniture')

		// ... get all furniture from Habbo that exists via furnidata.xml
		this.downloadFile(Config.furniDataURL, this.localFurniDataPath)

		// XML Data 
		this.XMLFurniData = IO.readFileSync(this.localFurniDataPath, { encoding: 'utf-8' })
	
		// create a JSON file and write XML that is converted to JSON
		this.writeFile(this.localFurniDataJSONPath, JSON.stringify(this.xmlToJson(this.XMLFurniData)))

		// // read from the frunidata.json file
		this.furniData = IO.readFileSync(this.localFurniDataJSONPath, { encoding: 'utf-8' }) //read furniData.json 	

		if (this.furniData !== null) 
		{
			this.compare()
			this.download()
		}
	
		// ... once all furniture is downloaded (swfs)
	}

	downloadFile(url, localPath) 
	{
		Download(url).then((data) => 
		{
			IO.writeFileSync(localPath, data, 'utf-8')
		})
	}


	compare() {
		// ... compare Habbo furniture to local FS
		// see the furniture folder names to the furnidata.json
		// and if its not present add it to the download queue
		
		this.furniData.furnidata.roomitemtypes.furnitype.forEach(furniture => {
			if (!IO.existsSync(Path.join(this.output, furniture.classname))) {
				this.downloadQueue.push(furniture)
			}
		})

		console.log('Download queue ', this.downloadQueue)
	}

	writeFile(path, data) {
		return IO.writeFileSync(path, data, { encoding: 'utf-8' })
	}

	xmlToJson(xml) {
		return Parser.parse(Format(xml.toString(), this.XMLOptions), this.JSONOptions)
	}

	download() {
		// ... Download missing files from the download queue
	    // images.habbo.com/dcr/49494/shelves_noja.swf
		this.downloadQueue.forEach(download => {
			this.downloadFile(url, Path.join(this.output, this.revision, this.download.classname))
		})
	}

	convert() {
		// ... Create a conversion queue to JSON and spritesheet
	}

}

var swf = new SWF()