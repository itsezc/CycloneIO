import { NEW_ROOM } from '../../../common/constants/room.js'
import { TILE } from '../constants/assets.js'

class Room {
    constructor(scene, socket, id) {
        this.scene = scene
        this.socket = socket
        this.id = id
        this.rooms = {}
    }

    create() {
        this.socket.emit(NEW_ROOM, this.id, [[0, 0]], { x: 0, y: 0 })

        this.socket.on(NEW_ROOM, (room) => {
            this.addRoom(room.id, room.rows, room.columns)
        })
    }

    addRoom(id, rows, columns) {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                var x = j * 32
                var y = i * 32

                var isometric = isometric(x, y)

                this.rooms[id].push(this.scene.physics.add.image(isometric.x, isometric.y, TILE))
            }
        }
    }

    isometric(cartesian) {
        var coordinates = new Phaser.Geom.Point()
        coordinates.x = cartesian.x - cartesian.y
        coordinates.y = (cartesian.x + cartesian.y) / 2
        return (coordinates)
    }
}

export default Room
