import { injectable, inject } from 'inversify'
import * as Phaser from 'phaser'

import Room from './rooms/Room'
import ISocketManager from './communication/ISocketManager';

@injectable()
export default class Habbo {
	private game: Phaser.Game
	private currentRoom: Room

	public socketManager: ISocketManager

	public constructor(
		@inject('ISocketManager') socketManager: ISocketManager
	) {
		this.socketManager = socketManager
	}

	public init(parent: string, socket: SocketIOClient.Socket) {
		if (!document.getElementById(parent)) {
			throw `${parent} is not an element.`
		}

		this.socketManager.init(socket)

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