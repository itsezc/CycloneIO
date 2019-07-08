import GuildBadgeRessource from './GuildBadgeRessource';
import BadgePartBase from './BadgePartBase';
import BadgePartSymbol from './BadgePartSymbol';
import { string } from 'prop-types';

export default class GuildBadge {

    private base: BadgePartBase;
    private symbols: BadgePartSymbol[] = [];

    constructor(base?: BadgePartBase, symbols: BadgePartSymbol[] = []) {
        this.base = base;
        this.symbols = symbols;
    }

    public setBase(base: BadgePartBase): void {
        this.base = base;
    }

    public addSymbol(symbol: BadgePartSymbol): void {
        this.symbols.push(symbol);
    }

    public removeSymbol(symbolPosition: number): void {
        this.symbols = this.symbols.splice(symbolPosition, 1);
    }

    public generate(guildBadgeRessource: GuildBadgeRessource): any {
        
        console.log("generate image svp");

        const baseImage = this.base.generate(guildBadgeRessource);
        
        for(var symbol of this.symbols) {

            const symbolImage = symbol.generate(guildBadgeRessource);
            const {x, y} = symbol.getDrawPosition(symbolImage);

            symbolImage.copy(baseImage, x, y, 0, 0, symbolImage.width, symbolImage.height);
        }

        return baseImage;
    }

    public static parsing(query: string, sizeChunk: number = 6): GuildBadge {

        let guildBadge: GuildBadge = new GuildBadge(); 

        const numParts = Math.ceil(query.length / sizeChunk);

        for(let i = 0, o = 0; i < numParts; ++i, o += sizeChunk) {
            
            const stringPart = query.substr(o, sizeChunk);

            const typePart = stringPart.charAt(0);
            if(!['t', 's', 'b'].includes(typePart)) break;

            let imageIndex: string = stringPart.slice(1, 3);
            const colorIndex: string = stringPart.slice(3, 5);
            const positionIndex: number = Number(stringPart.substr(-1));

            if(typePart == 'b'){
                guildBadge.setBase(new BadgePartBase(imageIndex, colorIndex, positionIndex));
            } else {

                if(typePart == 't')
                    imageIndex = (Number(imageIndex) + 64).toString();

                guildBadge.addSymbol(new BadgePartSymbol(imageIndex, colorIndex, positionIndex));
            }

            console.log(typePart, imageIndex, colorIndex, positionIndex);
        }

        return guildBadge;
    }
}
