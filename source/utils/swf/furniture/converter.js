// @flow
import Furnidata from './furnidata'
import FurnitureDownloader from './downloader'


import Parser from 'fast-xml-parser' 

import Download from 'download'

export default class FurnitureConverter {

	furnidata: Furnidata
	downloader: FurnitureDownloader

	constructor() {
		this.furnidata = new Furnidata()
		// Testing
		//this.downloader = new FurnitureDownloader(61856, 'shelves_norja')

	}

}

const converter = new FurnitureConverter()