export enum Type {
	FLOOR,
	WALL,
	EFFECT,
	BADGE,
	BOT,
	HABBO_CLUB,
	PET
}

export default abstract class Furniture {

	constructor(private readonly id: number,

				protected readonly name: string, protected readonly description: string,

				protected readonly type: Type,

				protected readonly width: number, protected readonly length: number,

				protected readonly allowStack: boolean, protected readonly stackHeight: number,

				protected readonly sittable: boolean, protected readonly walkable: boolean, protected readonly canLayOn: boolean,

				protected readonly recyclable: boolean, protected readonly tradable: boolean, protected readonly marketplaceSellable: boolean,

				protected readonly giftable: boolean, protected readonly allowInventoryStack: boolean,

				protected readonly interactionType: string, protected readonly interactionModesCount: number,

				protected readonly vendingIds: number[],

				protected readonly effectId: number, protected readonly songId: number,

				protected readonly variableHeights: number[]) {

		this.id = id

		this.name = name
		this.description = description

		this.type = type

		this.width = width
		this.length = length

		this.allowStack = allowStack
		this.stackHeight = stackHeight

		this.sittable = sittable
		this.walkable = walkable
		this.canLayOn = canLayOn

		this.recyclable = recyclable
		this.tradable = tradable
		this.marketplaceSellable = marketplaceSellable

		this.giftable = giftable
		this.allowInventoryStack = allowInventoryStack

		this.interactionType = interactionType
		this.interactionModesCount = interactionModesCount

		this.vendingIds = vendingIds

		this.effectId = effectId
		this.songId = songId

		this.variableHeights = variableHeights
	}
}