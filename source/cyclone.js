import Chalk from 'chalk'
import ReadLineSync from 'readline-sync'

import Database from './storage/database'

import Logger from './utils/logger'
import Server from './network/server'

import Config from '../config.json'

class Cyclone {
  constructor() {
    console.clear()

    console.log(Chalk.bold.blue('_________              .__                        '))
    console.log(Chalk.bold.blue('\\_   ___ \\___.__. ____ |  |   ____   ____   ____  '))
    console.log(Chalk.bold.blue('/    \\  \\<   |  |/ ___\\|  |  /  _ \\ /    \\_/ __ \\ '))
    console.log(Chalk.bold.blue('\\     \\___\\___  \\  \\___|  |_(  <_> )   |  \\  ___/ '))
    console.log(Chalk.bold.blue(' \\______  / ____|\\___  >____/\\____/|___|  /\\___  >'))
    console.log(Chalk.bold.blue('        \\/\\/         \\/                 \\/     \\/ \n\n'))

    console.log(`Version: ${Chalk.magenta.bold('1.0.0')} | License key : ${Chalk.magenta.bold(Config.license)}`)
    console.log(`Created by ${Chalk.red.bold('EZ-C 💖 Amor')}, ${Chalk.blue.bold('Sapphire')} and ${Chalk.green.bold('Rebel')} of ${Chalk.yellow.bold('Habbay')}\n`)

    this.db = new Database()
    this.init()
  }

  async init() {
    try {
      this.server = new Server()

      // ReadLineSync.promptLoop((command) => {
      //   console.log('-- You said "' + command + '"');
      // }, {
      // 	limit: '1-6'
      // })
      //
      // rl.on('line', (line) => {
      //
      //   if (line.startsWith('/')) {
      //     switch (line) {
      //       // case '/stats':
      //       //   this.getPlayers = this.Server.players
      //       //   Logger.info('There are currently ' + this.getPlayers + ' players')
      //       //   break
      //
      //       case '/clear':
      //         console.clear()
      //         break
      //
      //       case '/shutdown':
      //         Server.shutdown()
      //         break
      //
      //       default:
      //         console.log('sjsjs')
      //         Logger.error(`${line} is an unnamed command.`)
      //         break;
      //     }
      //   }
      // })
    } catch (error) {
      Logger.error(error)
    }
  }
}

let App = new Cyclone()
