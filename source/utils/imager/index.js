//import Config from './config.json'
import path from 'path'
import Parser from 'fast-xml-parser'
import fs, { writeFileSync } from 'fs'
import chalk from 'chalk'
import spritesheet from 'spritesheet-js'
import Download from 'download'
import { readFromBufferP, extractImages } from 'swf-extract';
import { unpack } from 'qunpack';

const Config = {
	"officialResUrl": "https://www.habbo.com/",
	"flashClientUrl": "https://habboo-a.akamaihd.net/gordon/PRODUCTION-201905292208-407791804/"
};

let symbols = [];

Download(`${Config.flashClientUrl}Habbo.swf`, path.join(__dirname, 'raw')).then(async () => {
	const rawData = fs.readFileSync(path.join(__dirname, 'raw', `Habbo.swf`));
 
			// (async () => {
				const swf = await readFromBufferP(rawData)

				let idx = 0;
				swf.tags.map(tag => {
					if (tag.code == 76)
					{
						writeFileSync(path.join(__dirname, 'raw', `${idx}.bin`), tag.rawData);
						
						let rawbuffer = unpack( "v", tag.rawData );
						rawbuffer = tag.rawData.slice(2);
						while (rawbuffer.length > 0)
						{
							let testnigger = unpack( "vZ+1", rawbuffer );
							symbols[testnigger[0]] = testnigger[1];
							rawbuffer = rawbuffer.slice(2 + testnigger[1].length + 1);
						}
					} 

					if (tag.code == 87)
					{
						const xml = Parser.parse(tag.rawData.toString(), {
							attributeNamePrefix : '', 
							ignoreAttributes: false, 
							parseAttributeValue: true 
						});
						
						//console.log(xml)

						if (xml.figuredata !== undefined)
						{
							writeFileSync(path.join(__dirname, 'raw', `HabboAvatarFigure_${idx}.json`), JSON.stringify(xml, null, 2));
						}

						if (xml.animationSet !== undefined)
						{
							writeFileSync(path.join(__dirname, 'raw', `HabboAvatarAnimation_${idx}.json`), JSON.stringify(xml, null, 2));
						}

						if (xml.geometry !== undefined)
						{
							writeFileSync(path.join(__dirname, 'raw', `HabboAvatarGeometry_${idx}.json`), JSON.stringify(xml, null, 2));
						}

						if (xml.partSets !== undefined)
						{
							writeFileSync(path.join(__dirname, 'raw', `HabboAvatarPartSets_${idx}.json`), JSON.stringify(xml, null, 2));
						}

						if (xml.actions !== undefined)
						{
							writeFileSync(path.join(__dirname, 'raw', `HabboAvatarActions_${idx}.json`), JSON.stringify(xml, null, 2));
						}

						// const firstIdx = Object.keys(xml)[0];
						// if (firstIdx !== undefined && xml[firstIdx].name !== undefined)
						// {	
						// 	console.log(xml[firstIdx].name);
						// }
					}
					idx++;
				});
				//fs.writeFileSync(path.join(__dirname, 'raw', "swftags.json"), JSON.stringify(swf, null, 2));



				const ts = await Promise.all(extractImages(swf.tags))
				ts.map(elem => {
					//console.log(elem);
					const imageName = `${symbols[elem.characterId]}.${elem.imgType}`;
					//console.log(path.join(__dirname, 'raw', imageName));
					fs.writeFileSync(path.join(__dirname, 'raw', imageName), elem.imgData);
				});

				console.log("Done")
				// let metaJSON = [];
				// let index = 0;
				// ts.map(elem => {
				// 	//console.log(elem);
				// 	const imageName = `${index}_${elem.characterId}.${elem.imgType}`;
				// 	//console.log(path.join(__dirname, 'raw', imageName));
				// 	fs.writeFileSync(path.join(__dirname, 'raw', imageName), elem.imgData);
				// 	index++;
				// });
	
				//fs.writeFileSync(path.join(__dirname, 'furni', furni.classname, 'meta.json'), JSON.stringify(metaJSON, null, 2));


			// })();
});


