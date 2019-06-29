import SetType from './setType';
import Set from './set';
import SetPart from './setPart';
import PartTypes from './partTypes';

import fs from 'fs';
import { promisify } from 'util';

import { Parser } from 'xml2js';
import xpath from 'xml2js-xpath';
import PartType from './partType';

const readFileAsync = promisify(fs.readFile);
const readDirAsync = promisify(fs.readdir);

export default class AvatarDataLoader {

    private readonly figureDataFile = "ressources/xml/figureData.xml";
    private readonly figureMapFile = "ressources/xml/figureMap.xml";
    private readonly assetsFolder = "ressources/xml/assets";

    private parser: Parser = new Parser({ attrkey: "$" });

    private figureMap: Map<number, String> = new Map();
    private figureData: Map<PartType, SetType> = new Map();
    private assetOffsetMap: Map<String, any> = new Map();
    private colorMap: Map<number, any> = new Map();

    public getPartName(id: number): String {

        if(this.figureMap.has(id))
            return this.figureMap.get(id);
        
        return "";
    }

    private async loadFigureMap() {

        console.log("Loading Figure Map")

        await readFileAsync(this.figureMapFile, 'utf-8').then((dataFile) => {
            this.parser.parseString(dataFile, (errXML, figureMapXML) => {
                
                for(var lib of figureMapXML["map"]["lib"]){

                    const id: String = lib["$"]["id"];

                    if(id.startsWith("hh_")) 
                        continue;

                    for(var part of lib["part"]){
                    
                        const partId: number = Number(part["$"]["id"]);
                        this.figureMap.set(partId, id);
                    }
                }
            });
        }).catch(e => console.error(e));
    }

    private async loadFigureData() {

        console.log("Loading Figure Data")

        await readFileAsync(this.figureDataFile, 'utf-8').then(dataFile => {
            this.parser.parseString(dataFile, async (errXML, figureDataXML) => {

                for(var palette of figureDataXML["figuredata"]["colors"][0]["palette"]){

                    const id: number = Number(palette["$"]["id"]);

                    for(var color of palette["color"]){
                        
                        const colorId: number = Number(color["$"]["id"]);

                        // #TODO: color = np.append(np.asarray(color_convert(int(color.text, 16))[1:4]) / 255, 1);
                        const colorValue = 0;
                        this.colorMap.set(colorId, colorValue);
                    }
                }

                for(var st of figureDataXML["figuredata"]["sets"][0]["settype"]){
                    
                    const type: String = st["$"]["type"];
                    const paletteId: String = st["$"]["paletteid"];

                    const setType: SetType = new SetType(PartTypes.fromKey(type), Number(paletteId));
                    
                    for(var s of st["set"]){
                        
                        const set: Set = new Set(Number(s["$"]["id"]), this.getPartName(s["$"]["id"]),
                            s["$"]["gender"], s["$"]["club"],
                            (s["$"]["colorable"] == 1), (s["$"]["selectable"] == 1), (s["$"]["prselectable"] == 1)
                        );

                        setType.addSet(set);

                        for(var p of s["part"]){

                            const part: SetPart = new SetPart(Number(p["$"]["id"]), PartTypes.fromKey(p["$"]["type"]), 
                                (p["$"]["colorable"] == 0), Number(p["$"]["index"]), Number(p["$"]["colorindex"]));
                            
                            set.addPart(part);
                        }

                        for(var h of xpath.find(s, "//hiddenlayers/layer")){
                            set.addHidenLayer(PartTypes.fromKey(h["$"]["parttype"]));
                        }
                    }

                    this.figureData.set(setType.getType(), setType);
                }
            });
        }).catch(e => console.error(e));
    }

    private async loadOffsetMap() {

        console.log("Loading Asset Data")

        await readDirAsync(this.assetsFolder).then(async (filesAssets) => {
            
            for(var file of filesAssets){
                
                const path: string = this.assetsFolder + "/" + file;

                await readFileAsync(path, 'utf-8').then((clothingOffsetFile) => {
                    this.parser.parseString(clothingOffsetFile, (errXML, clothingOffsetXML) => {

                        clothingOffsetXML = clothingOffsetXML["manifest"];

                        for(var a of xpath.find(clothingOffsetXML, "//library/assets/asset")){

                            if(a["$"]["mimeType"] == "image/png"){

                                const name: String = a["$"]["name"];
                                const param: any = xpath.find(a, "//param")[0];

                                if(param == undefined) 
                                    continue;
                                
                                const value: String[] = param["$"]["value"].split(",");
                                if(value.length == 2){
                                    try {
                                        // #TODO: ( np.asarray(Image.open((AVATAR_FOLDER + name + '.png')) ).astype(np.ubyte), (int(value[0]), int(value[1])))
                                        this.assetOffsetMap.set(name, [0, 0, 0]);
                                    } catch { continue; }
                                }
                            }
                        }
                    });
                }).catch(e => console.error(e));
            }
        }).catch(e => console.error(e));
    }

    public async load() {
    
        await this.loadFigureMap();
        await this.loadFigureData();
        await this.loadOffsetMap();

        console.log("Finished Loading Avatar Data")
    }

    public getFigureMap(){
        return this.figureMap;
    }

    public getFigureData(){
        return this.figureData;
    }

    public geOffsetMap(){
        return this.assetOffsetMap;
    }
}