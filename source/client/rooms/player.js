import Constants from '../../network/constants.json'
import Config from '../../../config.json'

class RoomPlayer {
    constructor(scene, socket, room, position) {
        this.scene = scene
        this.socket = socket
        this.room = room
        this.position = position
        this.players = {}
    }

    create() {
        this.socket.on(Constants.common.actions.player.CONNECT, () => {
            console.log(`Server connected on ${Config.server.host}`)
        })

        this.socket.emit(Constants.common.actions.player.NEW_PLAYER, this.room, this.position)

        this.socket.on(Constants.common.actions.player.NEW_PLAYER, (player) => {
            this.addPlayer(player.id, player.x, player.y, player.direction)
        })

        this.socket.on(Constants.common.actions.player.ALL_PLAYERS, (players) => {
            for (var i = 0; i < players.length; i++) {
                this.addPlayer(players[i].id, players[i].x, players[i].y, players[i].direction)
            }

            this.socket.on(Constants.common.actions.player.MOVE, (data) => {
                this.players[data.id].x = data.x
                this.players[data.id].y = data.y
                this.players[data.id].anims.play(data.direction, true)
            })

            this.socket.on(Constants.common.actions.player.STOP, (data) => {
                this.players[data.id].x = data.x
                this.players[data.id].y = data.y
                this.players[data.id].anims.stop()
            })

            this.socket.on(Constants.common.actions.player.REMOVE, (id) => {
                this.players[id].destroy()
                delete this.players[id]
            })

            this.registerChat()
        })
    }

    addPlayer(id, x, y, direction) {
        this.players[id] = this.scene.physics.add.sprite(x, y, Constants.client.assets.HH_HUMAN_BODY)
        this.players[id].anims.play(direction)
        //this.players[id].anims.stop()
    }

    left() {
        this.players[this.socket.id].body.velocity.x = -SPEED
        this.players[this.socket.id].anims.play(LEFT, true)
        this.socket.emit(KEY_PRESS, LEFT, { x: this.players[this.socket.id].x, y: this.players[this.socket.id].y })
    }

    right() {
        this.players[this.socket.id].body.velocity.x = SPEED
        this.players[this.socket.id].anims.play(RIGHT, true)
        this.socket.emit(KEY_PRESS, RIGHT, { x: this.players[this.socket.id].x, y: this.players[this.socket.id].y })
    }

    up() {
        this.players[this.socket.id].body.velocity.y = -SPEED
        this.players[this.socket.id].anims.play(UP, true)
        this.socket.emit(KEY_PRESS, UP, { x: this.players[this.socket.id].x, y: this.players[this.socket.id].y })
    }

    down() {
        this.players[this.socket.id].body.velocity.y = SPEED
        this.players[this.socket.id].anims.play(DOWN, true)
        this.socket.emit(KEY_PRESS, DOWN, { x: this.players[this.socket.id].x, y: this.players[this.socket.id].y })
    }

    stop() {
        this.players[this.socket.id].body.velocity.x = 0
        this.players[this.socket.id].body.velocity.y = 0
        this.players[this.socket.id].anims.stop()
        this.socket.emit(STOP, { x: this.players[this.socket.id].x, y: this.players[this.socket.id].y })
    }

    registerChat() {

    }
}

export default RoomPlayer
