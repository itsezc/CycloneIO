import Color from '../utils/Color'
import ChatBubblesManager from "./ChatBubblesManager";
import IChatBubbleStyle from "./style/IChatBubbleStyle";

export default class ChatBubble {

	private chatBubbleStyle: IChatBubbleStyle
	private container: Phaser.GameObjects.Container

	/*constructor(
		private style: number,
		private message: string,
		private username: string,
		private type: 'normal' | 'shout' | 'whisper' = 'normal',
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
			message.setPosition(0, -300)
			message.setDepth(2)

			this.scene.add.image(0, -300, `chat_style_${this.style}`).setDepth(1)
		}
	}*/

	public constructor(style: number, chatBubblesManager: ChatBubblesManager) {
		this.chatBubbleStyle = chatBubblesManager.getBubbleStyle(style)
	}

	generate(
		id: number,
		username: string,
		message: string,
		color: number,
		headImage: HTMLCanvasElement
	): HTMLCanvasElement {
		
		const bubbleCanvas: HTMLCanvasElement = document.createElement('canvas')
		const bubbleContext = bubbleCanvas.getContext('2d')

		const FONT = '400 13px Ubuntu'
		const FONT_BOLD = '600 13px Ubuntu'

		if (bubbleContext !== null) {
			
			/** Font Styling */
			bubbleContext.font = FONT_BOLD
			bubbleContext.textBaseline = 'top'
			bubbleContext.fillStyle = 'black'

			const RIGHT_WIDTH = 5
			const textMarginX = 32
			const textMarginY = 6
			const baseStartX = 24

			const usernameWidth = Math.round(bubbleContext.measureText(username + ': ').width)
			bubbleContext.font = FONT
			
			const messageWidth = Math.round(bubbleContext.measureText(message).width + 5) 
			const textWidth = usernameWidth + messageWidth

			bubbleCanvas.width = textMarginX + textWidth + RIGHT_WIDTH
			// bubbleCanvas.height = style.base.height

			// for (let i = baseStartX; i < textMarginX + textWidth; i++) {
			// 	bubbleContext.drawImage(
			// 		style.base, 
			// 		32, 
			// 		0, 
			// 		1, 
			// 		style.base.height, 
			// 		i, 
			// 		0, 
			// 		1,
			// 		style.base.height
			// 	)
			// }

			// bubbleContext.drawImage(
			// 	style.base,
			// 	style.base.width - RIGHT_WIDTH,
			// 	0,
			// 	RIGHT_WIDTH,
			// 	style.base.height,
			// 	textMarginX + textWidth,
			// 	0,
			// 	RIGHT_WIDTH,
			// 	style.base.height
			// )
			
			bubbleContext.textBaseline = 'top'
			bubbleContext.fillStyle = 'black'
			bubbleContext.font = FONT_BOLD

			bubbleContext.fillText(
				username + ': ',
				textMarginX + usernameWidth,
				textMarginY
			)

			// const colored = this.tint(style.color, color)
			// bubbleContext.drawImage(colored, 0, 0)
			bubbleContext.drawImage(headImage, -3, -7)
		}

		return bubbleCanvas
	}

	tint(
		img: HTMLCanvasElement | HTMLImageElement,
		color: number
	): HTMLCanvasElement | HTMLImageElement {
		let element = document.createElement('canvas')
		let context = element.getContext('2d')

		if (context === null) {
			return img
		}

		let RGB = Color.intToRGB(color)
		let width = img.width
		let height = img.height

		element.width = width
		element.height = height

		context.drawImage(img, 0, 0)
		let imageData = context.getImageData(0, 0, width, height)
		for (let y = 0; y < height; y++) {
			let inpos = y * width * 4
			for (let x = 0; x < width; x++) {
				
				inpos++
				inpos++
				inpos++

				let pa = imageData.data[inpos++]

				if (pa !== 0) {
					imageData.data[inpos - 2] = Math.round(RGB.B * imageData.data[inpos - 2] / 255)
					imageData.data[inpos - 3] = Math.round(RGB.G * imageData.data[inpos - 3] / 255)
					imageData.data[inpos - 4] = Math.round(RGB.R * imageData.data[inpos - 4] / 255)
				}
			}
		}

		context.putImageData(imageData, 0, 0)
		
		return element
	}
}