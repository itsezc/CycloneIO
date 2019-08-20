import * as Phaser from 'phaser'
import IRoom from "./IRoom"
import RoomData from "./data/IRoomData";

export default class Room extends IRoom {
	private readonly id: string

	public constructor(roomData: RoomData) {
		super({})

		this.id = roomData.id
	}

	public preload() {

	}

	public create() {
		let graphics = this.add.graphics({ fillStyle: { color: 0x00ff00 } });

		let circle = new Phaser.Geom.Circle(400, 300, 150);
		let point = new Phaser.Geom.Rectangle(0, 0, 8, 8);

		graphics.clear();
		graphics.fillRect(point.x - 4, point.y - 4, point.width, point.height);

	}
}
