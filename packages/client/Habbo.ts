import { injectable, inject } from 'inversify'
import * as Phaser from 'phaser'

import ISocketManager from './communication/ISocketManager';
import IRoomManager from "./rooms/IRoomManager";
import IRoom from "./rooms/IRoom";

@injectable()
export default class Habbo {
	private game: Phaser.Game

	private socketManager: ISocketManager
	private roomManager: IRoomManager

	public constructor(
		@inject('ISocketManager') socketManager: ISocketManager,
		@inject('IRoomManager') roomManager: IRoomManager
	) {
		this.socketManager = socketManager
		this.roomManager = roomManager
	}

	public init(parent: string, socket: SocketIOClient.Socket): void {
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

	public setScene(scene: Phaser.Scene): void {
		const key = (scene instanceof IRoom) ? 'room' : 'unknown'
		this.game.scene.add(key, scene, true)
	}
}
