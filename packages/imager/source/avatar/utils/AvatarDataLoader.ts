import fs from 'fs';
import { Parser } from 'xml2js';

export default class AvatarDataLoader {

    private readonly figureDataFile = "ressources/xml/figureData.xml";
    private readonly figureMapFile = "ressources/xml/figureMap.xml";

    private parser: Parser = new Parser({ attrkey: "$" });

    private figureMap: Map<number, String> = new Map();
    private figureData: Map<number, String>;
    private assetOffsetMap: Map<String, any>;
    private colorMap: Map<number, any>;

    public getPartName(id: number): any {

        if(this.figureMap.has(id))
            return this.figureMap.get(id);
        
        return "";
    }

    public async load() {

        const loadFigureMap = async () => {

            fs.readFile(this.figureMapFile, 'utf-8', (errFile, dataFile) => {
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
            });
        }

        const loadFigureData = async() => {

            fs.readFile(this.figureDataFile, 'utf-8', (errFile, dataFile) => {
                this.parser.parseString(dataFile, (errXML, figureDataXML) => {

                    for(var palette of figureDataXML["figuredata"]["colors"]){
                        const id: number = Number(palette["$"]["id"]);

                        for(var color of palette["colors"]){
                            
                            const colorId: number = Number(color["$"]["id"]);

                            // color = np.append(np.asarray(color_convert(int(color.text, 16))[1:4]) / 255, 1);
                            const colorValue = 0;

                            this.colorMap.set(colorId, colorValue);
                        }
                    }
                })
            })
        }

        loadFigureMap();
    }
}