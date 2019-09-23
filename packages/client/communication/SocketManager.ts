import { injectable, inject } from 'inversify'

import ISocketManager from './ISocketManager'
import IEventsManager from './events/IEventsManager'

@injectable()
export default class SocketManager implements ISocketManager {
	private socket: SocketIOClient.Socket
	private eventsManager: IEventsManager

	public constructor(@inject('IEventsManager') eventsManager: IEventsManager) {
		this.eventsManager = eventsManager

	}

	public init(socket: SocketIOClient.Socket): void {
		this.socket = socket

		this.assignEvents()
	}

	private assignEvents() {
		this.eventsManager.events.forEach((event, key) => {
			this.socket.on(key, (data: any) => {
				event.execute(data)
			})
		})
	}
}
