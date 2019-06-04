//import Config from './config.json'
import path from 'path'
import Parser from 'fast-xml-parser'
import fs from 'fs'
import chalk from 'chalk'
import spritesheet from 'spritesheet-js'
import { readFromBufferP, extractImages } from 'swf-extract';

const Config = {
	"downloadURL": "https://images.habbo.com/dcr/hof_furni/",
	"furniDataURL": "https://www.habbo.com/gamedata/furnidata_xml/furnidata.xml"
};

const buildFurniUrl = (revision, classname) => `${Config.downloadURL}${revision}/${classname}.swf`;

const writeFurni = async (furni) => {
	fs.writeFileSync(path.join(__dirname, 'furni', furni.classname, 'data.json'), JSON.stringify(furni, null, 2));
}

const downloadFurni = async (furni) => {
	return new Promise((resolve, reject) => {
		Download(buildFurniUrl(furni.revision, furni.classname), path.join(__dirname, 'furni', furni.classname)).then(async () => {
			//Extract images from swf

			const rawData = fs.readFileSync(path.join(__dirname, 'furni', furni.classname, `${furni.classname}.swf`));
 
			const swf = await readFromBufferP(rawData)
			// the result of calling `extractImages` resolves to an Array of Promises
			const ts = await Promise.all(extractImages(swf.tags))
			let metaJSON = [];
			ts.map(elem => {
				const {code, characterId, imgType} = elem;
				const imageName = `${furni.classname}_${characterId}.${imgType}`;
				metaJSON.push({code, characterId, imgType, imageName});

				fs.writeFileSync(path.join(__dirname, 'furni', furni.classname, imageName), elem.imgData);
			});

			spritesheet(path.join(__dirname, 'furni', furni.classname, `*.png`), {format: 'json'}, err => {
				if (err) throw err;
			   
				console.log(chalk`{green [Done]} Generating Spritesheet ${furni.name} (${furni.classname})`);
			});

			fs.writeFileSync(path.join(__dirname, 'furni', furni.classname, 'meta.json'), JSON.stringify(metaJSON, null, 2));

			setTimeout(() => {
				resolve();
			}, 50);

		}).catch(err => {
			reject(err);
		});
	});
}

const downloadSWFs = async (furnis) => {
	for (let furniId in furnis)
	{
		const furni = furnis[furniId];
		
		console.log(chalk`{blue [Downloading]} ${furni.name} (${furni.classname})`);

		try {
			await downloadFurni(furni);
			writeFurni(furni);
		} catch (err) {
			console.log(chalk`{red [ERROR]} ${furni.name} (${furni.classname}) ${buildFurniUrl(furni.revision, furni.classname)}`);
		}
		console.log(chalk`{green [Done]} ${furni.name} (${furni.classname})`);

		//nigg();
	}
}

import Download from 'download'

//Download(Config.furniDataURL, path.join(__dirname, 'raw')).then(() => {
	
	const xml = fs.readFileSync(path.join(__dirname, 'raw', 'furnidata.xml'));

	const {roomitemtypes, wallitemtypes} = Parser.parse(xml.toString(), {
		attributeNamePrefix : '', 
		ignoreAttributes: false, 
		parseAttributeValue: true 
	}).furnidata;
	
	downloadSWFs(roomitemtypes.furnitype.filter(furni => !furni.classname.includes('*')));

	// wallitemtypes.furnitype.map(furni => {
	// 	console.log(buildFurniUrl(furni.revision, furni.classname));
	// });
	
//});


