export default class RoomModel {
  constructor(map) {
    this.map = map
  }

  // create() {
  //   this.map.forEach((row) => {
  //     row.forEach((tile, index) => {
  //       if (this.leftEdge) {
  //
  //       } else if (this.bottomEdge) {
  //
  //       } else {
  //         return
  //       }
  //     })
  //   })
  // }

  get mapSizeX() {
    return this.map.length
  }

  get mapSizeY() {
    //return this.map.reduce((max, b) => Math.max(max, b));
  }

  get leftEdge() {
    this.map.forEach((row) => {
      row.find((tile, index) => {
        var leftTile = row[index - 1]

        if (tile === this.squareState.OPEN) {
          if (leftTile !== undefined) {
            if (leftTile === this.squareState.CLOSE) {
              return true
            }
          } else {
            return true
          }
        }
      })
    })
  }

  get bottomEdge() {
    this.map.forEach((row) => {
      var nextRow = this.map[this.map.indexOf(row) + 1]

      row.find((tile, index) => {
        if (tile === 0) {
          if (nextRow !== undefined) {
            if (nextRow[index] === this.squareState.CLOSE) {
              return true
            }
          } else {
            return true
          }
        }
      })
    })
  }

  get squareState() {
    return {
      OPEN: 0,
      CLOSE: 1
    }
  }
}
