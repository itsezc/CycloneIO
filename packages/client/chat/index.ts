export default class ChatBubble {

	bubble: Phaser.GameObjects.Container

	constructor(
		private style: number,
		private message: string,
		private username: string,
		private scene: Phaser.Scene
	) {
		this.bubble = new Phaser.GameObjects.Container(this.scene)		
		
		const bubble_asset = `/chat/${this.style}/bubble.png`
		const bubble_meta = `/chat/${this.style}/meta.json`

		const loader = new Phaser.Loader.LoaderPlugin(this.scene)

		loader.image(`chat_style_${this.style}`, bubble_asset)
		loader.json(`chat_style_meta_${this.style}`, bubble_meta)

		loader.start()

		loader.loadComplete = () => {
			const { width, height } = this.scene.textures.get(bubble_asset).getSourceImage()
			const meta = this.scene.cache.json.get(`chat_style_meta_${this.style}`)

			const { username } = meta
			const { style } = username
			
			const message = this.scene.add.text(0, 0, this.message, style)
			message.setOrigin(0, 0)
			message.setPosition(0, 300)
			message.setDepth(2)

			this.scene.add.image(0, 300, `chat_style_${this.style}`).setDepth(1)
		}
	}
}