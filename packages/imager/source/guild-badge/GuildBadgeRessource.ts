import fs from 'fs';

export default class GuildBadgeRessource {

    private readonly resourcePath = 'resources/badge';
    private readonly basesPath: string = this.resourcePath + '/bases';
    private readonly symbolsPath: string = this.resourcePath + '/symbols';

    private readonly configurationPath = this.resourcePath + '/configurations';

    public symbols: Object;
    public bases: Object;
    public colors: {[key: string]: any};

    public constructor(){
        
        let basesJSON = fs.readFileSync(this.configurationPath + '/bases.json');
        this.bases = JSON.parse(basesJSON.toString());

        let symbolsJSON = fs.readFileSync(this.configurationPath + '/symbols.json');
        this.symbols = JSON.parse(symbolsJSON.toString());

        let colorsJSON = fs.readFileSync(this.configurationPath + '/colors.json');
        this.colors = JSON.parse(colorsJSON.toString());
    }

    public getColor(index: string): number[] {
        return this.colors[index];
    }

    public getBaseData(index: string): Object {
        return this.bases[index];
    }

    public getBasesPath(): string {
        return this.basesPath;
    }

    public getSymbolData(index: string): Object {
        return this.symbols[index];
    }

    public getSymbolsPath(): string {
        return this.symbolsPath;
    }
}