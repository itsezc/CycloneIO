import Chalk from 'chalk'
import Logger from '../utils/logger'

import Constants from './constants.json'

import SocketIO from 'socket.io'

import Hapi from 'hapi'
import Inert from 'inert'
import Routes from './http/routes'

import RoomPlayer from '../core/rooms/player'

export default class Server {
  constructor() {
    this.HTTP = new Hapi.Server({
      port: 8081
    })
    this.socketIO = new SocketIO(this.HTTP.listener)

    this.start()
  }

  async start() {
    try {
      await this.HTTP.register(Inert)
      await this.HTTP.route(Routes)
      await this.HTTP.start()
    } catch (error) {
      Logger.error(error)
      process.exit(1)
    }

    Logger.info(`Server running on port ${this.HTTP.info.port}.`)

    this.socketIO.on(Constants.common.server.CONNECTION, (socket) => {
      RoomPlayer.onConnect(this.socketIO, socket)

      socket.on(Constants.common.actions.player.DISCONNECT, () => {
        RoomPlayer.onDisconnect(this.socketIO, socket)
      })
    })
  }

  shutdown() {
    this.socketIO.emit(Constants.common.this.SHUTDOWN)

    this.HTTP.stop({
      timeout: 100000
    }).then((error) => {
      Logger.error(error)
    })

    Logger.info('Server shutted down.')
    process.exit(0)
  }
}
