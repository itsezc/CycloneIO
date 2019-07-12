import Furniture, { Type } from '../furniture/furniture';
import RoomPlayer from './player';
import Room from './room';
import Vector from 'packages/common/types/rooms/vector';

export default class RoomItem extends Furniture {

	constructor(private readonly item: number, private readonly owner: number, private readonly room: number,

				// #region furniture
				private readonly furniture: number,
				protected readonly name: string, protected readonly description: string, protected readonly type: Type,
				protected readonly width: number, protected readonly length: number, protected readonly allowStack: boolean,
				protected readonly stackHeight: number, protected readonly sittable: boolean, protected readonly walkable: boolean,
				protected readonly canLayOn: boolean, protected readonly recyclable: boolean, protected readonly tradable: boolean,
				protected readonly marketplaceSellable: boolean, protected readonly giftable: boolean,
				protected readonly allowInventoryStack: boolean, protected readonly interactionType: string,
				protected readonly interactionModesCount: number, protected readonly vendingIds: number[],
				protected readonly effectId: number, protected readonly songId: number, protected readonly variableHeights: number[],
				// #endregion

				private readonly rotation: number,

				private readonly floorCoordinates: Vector, private readonly wallCoordinates: Vector) {

		super(furniture, name, description, type, width, length, allowStack, stackHeight, sittable, walkable, canLayOn,
			  recyclable, tradable, marketplaceSellable, giftable, allowInventoryStack, interactionType, interactionModesCount,
			  vendingIds, effectId, songId, variableHeights)

		this.item = item
		this.owner = owner
		this.room = room

		this.rotation = rotation

		this.floorCoordinates = floorCoordinates
		this.wallCoordinates = wallCoordinates
	}

	public get Id() {
		return this.item
	}
}