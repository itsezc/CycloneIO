import BadgePart from "./BadgePart";
import GuildBadgeRessource from './GuildBadgeRessource';

export default class BadgePartBase extends BadgePart {

    getResourcePath(guildBadgeRessource: GuildBadgeRessource): string {
        return guildBadgeRessource.getBasesPath();
    }

    getResourceData(guildBadgeRessource: GuildBadgeRessource): Object {
        return guildBadgeRessource.getBaseData(this.elementIndex);
    }
}