import { inject, injectable } from 'inversify'
import * as PIXI from 'pixi.js-legacy'
import { Viewport } from 'pixi-viewport'

import ISocketManager from './communication/ISocketManager'
import IRoomManager from './rooms/IRoomManager'
import ICullManager from './rooms/cull/ICullManager'

import RoomScene from './rooms/RoomScene'
import RoomData from './rooms/data/RoomData'

@injectable()
export default class Habbo {
	public static readonly DEBUG = true

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

		console.log(this.application)

		this.application.stage.addChild(this.viewport)

		this.viewport.drag({
			wheel: false,
			mouseButtons: 'left'
		})

		this.cullManager.setViewport(this.viewport)

		this.resizeEvents()

		this.addDefaultRoom()

		parentElement.appendChild(this.application.view)
	}

	private resizeEvents(): void {
		window.onresize = (): void => {
			this.viewport.resize(window.innerWidth, window.innerHeight)

			this.cullManager.handleMove()
		}
	}

	private addDefaultRoom() {
		let data: RoomData = {
			allowPets: false,
			allowPetsEating: false,
			category: null,
			currentUsers: 1,
			description: null,
			floorThickness: 7,
			hideWalls: false,
			hideWired: false,
			id: '09ASAS9USIdsdDUdsdBXXBb29UWa',
			map: {
				room: [
					'010000',
					'000000',
					'000000',
					'000000'
				]
			},
			maxUsers: 25,
			name: 'Room #1',
			type: 'Roleplay',
			wallHeight: 3,
			wallThickness: 7
		}

		let room = this.roomManager.createRoom(data)
		this.roomManager.setRoom(room)
	}

	public loadRoom(room: RoomScene): void {
		this.viewport.addChildAt(room, 0)
	}

	public get loader(): PIXI.Loader {
		return this.application.loader
	}
}
