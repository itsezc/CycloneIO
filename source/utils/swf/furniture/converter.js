// @flow
import FurnitureDownloader from './downloader'

import Parser from 'fast-xml-parser' 

import Download from 'download'

export default class FurnitureConverter {

	downloader: FurnitureDownloader

	constructor() {
		// Testing
		this.downloader = new FurnitureDownloader(61856, 'shelves_norja')

	}

	parse() {

	}

}

const converter = new FurnitureConverter()