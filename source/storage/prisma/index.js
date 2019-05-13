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
    name: "CatalogPage",
    embedded: false
  },
  {
    name: "CatalogItem",
    embedded: false
  },
  {
    name: "Room",
    embedded: false
  },
  {
    name: "Item",
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
