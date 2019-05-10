export default class Item {
    +id: number
    +spriteId: number
    +name: string
    +spriteName: string
    +type: string
    +width: number
    +length: number
    +stackHeight: number
    +canStack: boolean
    +canWalk: boolean
    +canSit: boolean

    constructor(id: number, spriteId, name: string, spriteName: string, type: string, width: number, length: number, stackHeight: number, canStack: boolean, canWalk: boolean, canSit: boolean) {
        this.id = id
        this.spriteId = spriteId
        this.name = name
        this.spriteName = spriteName
        this.type = type
        this.width = width
        this.length = length
        this.stackHeight = stackHeight
        this.canStack = canStack
        this.canWalk = canWalk
        this.canSit = canSit
    }
}