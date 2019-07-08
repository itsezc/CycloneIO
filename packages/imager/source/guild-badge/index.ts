import GuildBadge from './GuildBadge';
import GuildBadgeRessource from './GuildBadgeRessource';
import BadgePartBase from './BadgePartBase';
import BadgePartSymbol from './BadgePartSymbol';

var guildBadgeRessource = new GuildBadgeRessource();

var start = new Date()
var hrstart = process.hrtime()


let base: BadgePartBase = new BadgePartBase("06", "13", 4);

let symbols: BadgePartSymbol[] = [
    new BadgePartSymbol("45", "14", 1),
    new BadgePartSymbol("103", "08", 7)
]

let guildBadge = new GuildBadge(base, symbols);
guildBadge.generate(guildBadgeRessource);


let end = new Date() - start;
let hrend = process.hrtime(hrstart);

console.info('Execution time: %dms', end);
console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000);
