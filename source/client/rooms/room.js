import Constants from '../../network/constants.json'

class Room {
  constructor(scene, socket, id) {
    this.scene = scene
    this.socket = socket
    this.id = id
    this.rooms = {}
  }

  create() {
    this.socket.emit(Constants.common.actions.room.NEW_ROOM, this.id, [
      [0, 0],
      [0, 0],
      [0, 0, 0, 0]
    ], {
      x: 0,
      y: 0
    })

    this.socket.on(Constants.common.actions.room.NEW_ROOM, (room, rows, columns) => {
      console.log('new room ' + JSON.stringify(room, null, 4))
      this.addRoom(room.id, rows, columns)
    })
  }

  addRoom(id, rows, columns) {
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < columns; j++) {
        var x = (i * 32) - (j * 32)
        var y = ((i * 32) + (j * 32)) / 2

        this.drawTile(x, y)
      }
    }
  }

  drawTile(x, y) {
    const width = 64
    const height = 32
    const thick = 7.5 // default is 7.5

    var tile = this.scene.add.graphics()

    tile.lineStyle(1, 0x8E8E5E)
    tile.fillStyle(0x989865)

    tile.beginPath()

    tile.moveTo(x, y)
    tile.lineTo(x - width / 2, y + height / 2)
    tile.lineTo(x, y + height)
    tile.lineTo(x + width / 2, y + height / 2)
    tile.lineTo(x, y)
	tile.closePath()
    tile.strokePath()
    tile.fillPath()

    if (thick > 0) {
      tile.lineStyle(1, 0x7A7A51)
      tile.fillStyle(0x838357)

      tile.beginPath()

      tile.moveTo((x - width / 2), y + height / 2)
      tile.lineTo((x - width / 2), y + height / 2 + thick)
      tile.lineTo(x, y + height + thick)
      tile.lineTo(x, y + height)
	  tile.closePath()
      tile.strokePath()
      tile.fillPath()

      // tile.fillStyle(0x6F6F49)
      // tile.lineStyle(1, 0x676744)
	  //
      // tile.beginPath()
	  //
      // tile.moveTo((x + width / 2) + 0.5, y + height / 2)
      // tile.lineTo((x + width / 2) + 0.5, y + height / 2 + thick)
      // tile.lineTo(x + 0.5, y + height + thick)
      // tile.lineTo(x + 0.5, y + height)
	  //
      // tile.fillPath()
      // tile.strokePath()
    }
  }
}

export default Room
