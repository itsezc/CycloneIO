/** 
 * 
import Room from '../room'
//import RoomTile from './tile'

import Vector from '../../../common/types/rooms/vector'
import IGameObject from '../../games/object'

export default class RoomMap extends Phaser.GameObjects.Container implements IGameObject
{
	// room[ids] -> 1 map
	public scene: Room
	private map: number[][]

	private tile!: RoomTile

	constructor(scene: Room, map: number[][]) 
	{
		super(scene)

		this.scene = scene
		this.map = map

		this.create()
	}

	public create(): void
	{
		for (var x = 0;x < this.map.length;x++)
		{
			for (var y = 0;y < this.map[x].length;y++)
			{
				if (this.map[x][y] > 0)
				{
					this.addTile({ x, y, z: 0 }, { top: { fill: 0x989865, stroke: 0x8E8E5E },
												   left: { fill: 0x838357, stroke: 0x7A7A51 }, 
												   bottom: { fill: 0x6F6F49, stroke: 0x676744 } })
				}
			}
		}
	}

	addTile(coordinates: Vector, partColors?: { top: { fill: number, stroke: number }, 
												left: { fill: number, stroke: number },
												bottom: { fill: number, stroke: number } }, texture?: string): void
	{
		//this.tile = new RoomTile(this.scene, coordinates, 0, partColors)

		this.add(this.tile)

		this.tile.id = this.getIndex(this.tile)
	}
} */