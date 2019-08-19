export default class Habbo {
	private game: Phaser.Game
	private socket: SocketIOClient.Socket

	public constructor(parent: string, socket: SocketIOClient.Socket) {
		if(!document.getElementById(parent)) {
			throw `${parent} is not an element.`
		}

		this.socket = socket

		const config = {
			resolution: window.devicePixelRatio,
			type: Phaser.WEBGL,
			parent,
			render: {
				pixelArt: true
			},
			physics: {
				default: 'arcade'
			},
			disableContextMenu: false,
			scale: {
				mode: Phaser.Scale.ScaleModes.RESIZE,
				width: window.innerWidth,
				height: window.innerHeight,
			}
		}

		this.game = new Phaser.Game(config)
	}
}