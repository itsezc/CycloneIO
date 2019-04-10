import Constants from '../../network/constants.json'

export default class Room {
  constructor(scene, socket, id) {
    this.scene = scene
    this.socket = socket
    this.id = id
  }

  create() {
    this.socket.emit(Constants.common.actions.room.NEW_ROOM, this.id, [
      [0, 0, 0],
      [0, 0, 1],
      [0, 0, 0]
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
    // console.log('Rows : ', rows)
    // console.log('Cols : ', columns)
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < columns; j++) {
        var x = (i * 32) - (j * 32)
        var y = ((i * 32) + (j * 32)) / 2



        /* rows.forEach(function(element) {
          TODO: do this process on server (?)
          //console.log(element)
          element.find(function(instance, index) {
            if(instance < 1) { //Check if its a tile
              //console.log(instance + ' [' + index + ']')
              if(index != 0) { //If it isn't the first tile check for the left and right
                //console.log('Element to the left is is ' + element[index - 1] + ' and right is ' + element[index + 1])
                if(element[index -1 ] != 0) {
                  this.drawTile(x, y, true)
                }
              } else {
                this.drawTile(x, y, true)
              }

              this.drawTile(x, y)
            }
          })
        }) */
      }
    }
  }

  drawTile(x, y, border = false) {
    // TODO: rewrite this
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

    if (thick > 0 && border) {
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
