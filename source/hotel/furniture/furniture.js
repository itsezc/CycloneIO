// @flow
export default class Furniture {
    +id: number
    +name: string
    +description: string
    +type: string
    +width: number
    +length: number
    +height: number
    +canStand: boolean
    +canStack: boolean
    +canWalk: boolean
    +canSit: boolean
    +buildersClub: boolean


    +spriteName: string

    // 15pillar.swf
    // Green Pillar () 

    /*
        "id": "3079",
        "classname": "ads_idol_clRack",
        "revision": "45508",
        "defaultdir": "0",
        "xdim": "3",
        "ydim": "1",
        "name": "Clothes Rack",
        "description": "Finally! Somewhere to hang up your clothes.",
        "offerid": "-1",
        "buyout": "0",
        "rentofferid": "-1",
        "rentbuyout": "0",
        "bc": "0",
        "excludeddynamic": "0",
        "specialtype": "1",
        "canstandon": "0",
        "cansiton": "0",
        "canlayon": "0",
        "furniline": "ad_sales"
    */

    
    constructor(id: number, name: string, spriteName: string, description: string, type: string, width: number, length: number, height: number, canStack: boolean, canStand: boolean, canWalk: boolean, canSit: boolean, buildersClub: boolean) {
        this.id = id
        this.name = name
        this.spriteName = spriteName
        this.description = description
        this.type = type
        this.width = width
        this.length = length
        this.height = height
        this.canStand = canStand
        this.canStack = canStack
        this.canWalk = canWalk
        this.canSit = canSit
    }
}