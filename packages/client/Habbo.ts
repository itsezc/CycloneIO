import {inject, injectable} from 'inversify'
import * as PIXI from 'pixi.js-legacy'
import {Viewport} from 'pixi-viewport'

import ISocketManager from './communication/ISocketManager'
import IRoomManager from './rooms/IRoomManager'
import ICullManager from './rooms/cull/ICullManager'

import RoomScene from './rooms/RoomScene'

@injectable()
export default class Habbo {
	public static readonly DEBUG = false

	public application: PIXI.Application
	public viewport: Viewport

	private socketManager: ISocketManager
	private roomManager: IRoomManager
	private cullManager: ICullManager

	public constructor(
		@inject('ISocketManager') socketManager: ISocketManager,
		@inject('IRoomManager') roomManager: IRoomManager,
		@inject('ICullManager') cullManager: ICullManager
	) {
		this.socketManager = socketManager
		this.roomManager = roomManager
		this.cullManager = cullManager
	}

	public init(parent: string, socket: SocketIOClient.Socket): void {
		const parentElement = document.getElementById(parent)

		if (!parentElement) {
			throw `${parent} is not an element.`
		}

		this.socketManager.init(socket)

		const config = {
			width: window.innerWidth,
			height: window.innerHeight,
			resolution: window.devicePixelRatio || 1,
			resizeTo: window
		}

		PIXI.settings.ROUND_PIXELS = true

		this.viewport = new Viewport()
		this.application = new PIXI.Application(config)

		this.application.stage.addChild(this.viewport)

		this.viewport.drag({
			wheel: false,
			mouseButtons: 'left'
		})

		this.cullManager.setViewport(this.viewport)

		this.resizeEvents()

		parentElement.appendChild(this.application.view)
	}

	private resizeEvents(): void {
		window.onresize = (): void => {
			this.viewport.resize(window.innerWidth, window.innerHeight)

			this.cullManager.handleMove()
		}
	}

	public loadRoom(room: RoomScene): void {
		this.viewport.addChildAt(room, 0)
	}

	public get loader(): PIXI.Loader {
		return this.application.loader
	}
}
