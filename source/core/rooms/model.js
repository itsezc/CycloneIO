import Environment from '../../environment'
import Constants from '../../network/constants.json'

export default class RoomModel {
  constructor(roomID, map) {
    this.roomID = roomID
    this.map = map
  }

  init() {
    this.map.forEach((row, rowIndex) => {
      row.forEach((tile, tileIndex) => {
        var x = (rowIndex * 32) + (tileIndex * 32)
        var y = ((rowIndex * 32) - (tileIndex * 32)) / 2

        if (tile === this.squareType.TILE) {
          Environment.instance.server.socketIO.to(this.roomID).emit(Constants.common.actions.room.NEW_TILE, 7.5, x, y, this.leftEdge(row, tile, tileIndex), this.bottomEdge(rowIndex, tile, tileIndex))
        }
      })
    })
  }

  leftEdge(row, tile, tileIndex) {
    var leftTile = row[tileIndex - 1]

    if (leftTile !== this.squareType.TILE) {
      return true
    } else {
      return false
    }
  }

  bottomEdge(rowIndex, tile, tileIndex) {
    var bottomRow = this.map[rowIndex + 1]

    if (bottomRow !== undefined) {
      var bottomTile = this.map[rowIndex + 1][tileIndex]

      if (bottomTile !== this.squareType.TILE) {
        return true
      } else {
        return false
      }
    } else {
      return true
    }
  }

  get squareType() {
    return {
      BLANK: 0,
      TILE: 1,
    }
  }
}
