import Logger from '../utils/logger'

import Constants from './constants.json'

import SocketIO from 'socket.io'

import Hapi from 'hapi'
import Inert from 'inert'
import Routes from './http/routes'

import RoomPlayer from '../core/rooms/player'

class Server {
  static async start() {
    // Server.SocketIO.on(Constants.common.server.CONNECTION, (socket) => {
    //   RoomPlayer.onConnect(Server.SocketIO, socket)
    //   Logger.info(`Player ${socket.id} connected.`)
    //   RoomPlayer.list[socket.room]++
    //
    //   socket.on(Constants.common.actions.player.DISCONNECT, () => {
    //     RoomPlayer.onDisconnect(Server.SocketIO, socket)
    //     Logger.info(`Player ${socket.id} disconnected.`)
    //     RoomPlayer.list[socket.room]--
    //   })
    // })

    try {
      await Server.HTTP.register(Inert)
      await Server.HTTP.route(Routes)
      await Server.HTTP.start()
    } catch (error) {
      Logger.error(error)
      process.exit(1)
    }

    Logger.info(`Server running on port ${Server.HTTP.info.port}.`)
  }

  static shutdown() {
    Server.SocketIO.emit(Constants.common.server.SHUTDOWN)

    Server.HTTP.stop({
      timeout: 100000
    }).then((error) => {
      Logger.info('Server gracefully stopped.')
    })
  }
}

Server.HTTP = new Hapi.Server({
  port: 8081
})

Server.SocketIO = new SocketIO(Server.HTTP.listener)

export default Server
