"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "banType",
    embedded: false
  },
  {
    name: "banStatus",
    embedded: false
  },
  {
    name: "roomType",
    embedded: false
  },
  {
    name: "Gender",
    embedded: false
  },
  {
    name: "FurniType",
    embedded: false
  },
  {
    name: "CatalogPageLayout",
    embedded: false
  },
  {
    name: "Ban",
    embedded: false
  },
  {
    name: "Badge",
    embedded: false
  },
  {
    name: "Bot",
    embedded: false
  },
  {
    name: "CatalogFeatured",
    embedded: false
  },
  {
    name: "CatalogPage",
    embedded: false
  },
  {
    name: "Rank",
    embedded: false
  },
  {
    name: "Language",
    embedded: false
  },
  {
    name: "Chatlog",
    embedded: false
  },
  {
    name: "ChatlogConsole",
    embedded: false
  },
  {
    name: "ChatlogConsoleInvitations",
    embedded: false
  },
  {
    name: "Room",
    embedded: false
  },
  {
    name: "NavigatorTab",
    embedded: false
  },
  {
    name: "NavigatorCategory",
    embedded: false
  },
  {
    name: "News",
    embedded: false
  },
  {
    name: "Habbo",
    embedded: false
  },
  {
    name: "User",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `http://localhost:4466`
});
exports.prisma = new exports.Prisma();
