import RoomChat from '../rooms/chat'
import Room from '../rooms/Room'
import Chat from "../rooms/chat";

const ROLL_PERIOD = 5000

export default class ChatManager {
	
	private chats: Chat[] = []
	private container: Phaser.GameObjects.Container = this.room.add.container(0, 0)
	private chatRolls: number = 0
	private needsRoll: boolean = false

	public constructor(
		public room: Room
	) {}

	public rollChats(amount: number)
	{

		for (let chat of this.chats) {
			chat.targetY -= (23 * amount)
		}

		this.chatRolls = 0
		this.needsRoll = false

	}

	public addChat(
		user: number,
		message: string,
		style: number
	) {


		if (this.needsRoll) {
			this.rollChats(1)
		}


		this.needsRoll = true
	}

	private tick(delta: number) {
		
		this.chatRolls += delta
		
		if (this.chatRolls > ROLL_PERIOD) {
			this.rollChats(Math.round(this.chatRolls / ROLL_PERIOD))
			this.chatRolls = 0
		}

		for (let chat of this.chats) {
			chat.move(delta)
		}

	}
}
