import BadgePart from "./BadgePart";
import GuildBadgeRessource from './GuildBadgeRessource';

export default class BadgePartSymbol extends BadgePart {

    getResourcePath(guildBadgeRessource: GuildBadgeRessource): string {
        return guildBadgeRessource.getSymbolsPath();
    }

    getResourceData(guildBadgeRessource: GuildBadgeRessource): Object {
        return guildBadgeRessource.getSymbolData(this.elementIndex);
    }
}