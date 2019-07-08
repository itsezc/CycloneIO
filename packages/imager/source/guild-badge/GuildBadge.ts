import GuildBadgeRessource from './GuildBadgeRessource';
import BadgePartBase from './BadgePartBase';
import BadgePartSymbol from './BadgePartSymbol';

export default class GuildBadge {

    private base: BadgePartBase;
    private symbols: BadgePartSymbol[] = [];

    constructor(base: BadgePartBase, symbols: BadgePartSymbol[] = []) {
        this.base = base;
        this.symbols = symbols;
    }

    public addSymbol(symbol: BadgePartSymbol): void {
        this.symbols.push(symbol);
    }

    public removeSymbol(symbolPosition: number): void {
        this.symbols = this.symbols.splice(symbolPosition, 1);
    }

    public generate(guildBadgeRessource: GuildBadgeRessource){
        
        console.log("generate image svp");

        const baseImage = this.base.generate(guildBadgeRessource);
        
        for(var symbol of this.symbols) {

            const symbolImage = symbol.generate(guildBadgeRessource);
            const {x, y} = symbol.getDrawPosition(symbolImage);

            symbolImage.copy(baseImage, x, y, 0, 0, symbolImage.width, symbolImage.height);
        }

        baseImage.savePng('output_badge.png', 1, (err) => { console.error(err); })
    }
}
