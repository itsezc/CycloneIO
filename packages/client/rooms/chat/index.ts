const SPEED = 92

export default class Chat {

	deltaY: number
	targetY: number
	
	constructor(
		private id: number,
		private message: string,
		private style: number,
		private user: User,
		private sprite: Phaser.GameObjects.Sprite
	) {

		this.deltaY = sprite.y
		this.targetY = sprite.y
	
	}

	move(delta: number) {
		
		delta = delta / 1000

		if (this.targetY < this.deltaY) {

			this.deltaY -= SPEED * delta

			if (this.deltaY < this.targetY) {
				this.deltaY = this.targetY
			}

			this.updateSpritePosition()
		}
	}

	updateSpritePosition() {

		this.sprite.y = this.deltaY

	}
}