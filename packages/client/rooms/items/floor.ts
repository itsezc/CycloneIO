import { Direction } from 'packages/client/avatar'
import Room from '../room'
import RoomItem from '../item'

export default class FloorItem extends RoomItem {

	constructor(
		public id: number, 
		public x: number,
		public y: number,
		public z: number,
		public state: number,
		public rotation: Direction,
		public base: number,
		public room: Room
	)
	{
		super(
			id,
			x,
			y,
			z,
			state,
			rotation,
			base,
			room
		)
	}


	updatePosition(tileX: number, tileY: number, tileZ: number, rotation: Direction, drawAsIcon:boolean) 
    {
        this.x = tileX 
        this.y = tileY
        this.z = tileZ 
        this.rotation = rotation
		this.drawAsIcon = drawAsIcon
		
		

        //this.updateSpritePosition()
    }
}