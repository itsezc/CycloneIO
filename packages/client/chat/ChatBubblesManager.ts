import Chat from '../rooms/chat'
import Room from '../rooms/Room'
import IChatBubbleStyle from "./style/IChatBubbleStyle";

const ROLL_PERIOD = 5000

export default class ChatBubblesManager {
	
	private chats: Chat[] = []
	private container: Phaser.GameObjects.Container
	private chatRolls: number = 0
	private needsRoll: boolean = false

	private chatBubbleStyles: Map<number, IChatBubbleStyle>

	public constructor(
		public room: Room
	) {
		this.container = this.room.add.container(0, 0)
	}

	public getBubbleStyle(id: number): IChatBubbleStyle {
		return this.chatBubbleStyles.get(id) || this.getBubbleStyle(1)
	}

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
