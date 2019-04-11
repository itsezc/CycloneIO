import Constants from '../../network/constants.json'

export default class Room {
    constructor(scene, socket, id) {
        this.scene = scene
        this.socket = socket
        this.id = id

        this.tiles = this.scene.add.group()
    }

    create() {
        this.socket.emit(Constants.common.actions.room.NEW_ROOM, this.id, [
            [0, 0, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 0]
        ], {
            x: 0,
            y: 0
        })

        this.socket.on(Constants.common.actions.room.NEW_ROOM, (room, model) => {
            // console.log(model)
            console.log(JSON.stringify(room, null, 4))
            this.addRoom(room.id, 10, 15)
        })
    }

    addRoom(id, rows, columns) {
        // console.log('Rows : ', rows)
        // console.log('Cols : ', columns)

        var i = [
        	[1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        	[1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        	[0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        	[0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0],
        	[0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0],
        	[0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0],
        	[0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        	[0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        	[0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ]

        let mapRows = i.length
        var mapColumns = 0
        i.forEach((row) => {
            if (row.length > mapColumns) {
                mapColumns = row.length
            }
        })

		console.log(i)

		i.forEach((row, rowIndex) => {
		  var nextRow = i[i.indexOf(row) + 1]
		  row.find((tile, columnIndex) => {
			if (tile === 1) {
			  if (nextRow !== undefined) {
				if (nextRow[columnIndex] === 0) {
				  console.log('Row ', rowIndex , '[', columnIndex ,'] is bottom')
				}
			  } else {
				return
			  }
			}
		  })
		})

        i.forEach((row, rowIndex) => {
            row.find((tile, columnIndex) => {
                var leftTile = row[columnIndex - 1]
				var nextRow = i[i.indexOf(row) + 1]
                var x = (rowIndex * 32) + (columnIndex * 32)
                var y = ((rowIndex * 32) - (columnIndex * 32)) / 2

                if (tile === 1) { // If its a tile
					if (nextRow !== undefined) { //Not the last row
						if(leftTile !== undefined) { //Left tile exists
							if (leftTile === 0) {
								if (nextRow[columnIndex] === 0) { //If bottom is empty
									this.drawTile(x, y, true, true)
								} else { //Else draw only left border
									this.drawTile(x, y, true)
								}
							} else {
								if (nextRow[columnIndex] === 0) { //If bottom is empty
									this.drawTile(x, y, false, true)
								}
							}
						} else {
							this.drawTile(x, y, true, true)
						}

					} else { //Last row
						if (leftTile !== undefined) {
							if (leftTile === 0) {
								this.drawTile(x, y, true, true)
							}
						}
						this.drawTile(x, y, false, true)
					}

					this.drawTile(x, y)
                }
            })
        })
    }

    drawTile(x, y, borderLeft = false, borderBottom = false) {
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

        if (thick > 0 && borderLeft) {
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
        }

        if (thick > 0 && borderBottom) {
			tile.fillStyle(0x6F6F49)
            tile.lineStyle(1, 0x676744)
            tile.beginPath()
            tile.moveTo((x + width / 2) + 0.5, y + height / 2)
            tile.lineTo((x + width / 2) + 0.5, y + height / 2 + thick)
            tile.lineTo(x + 0.5, y + height + thick)
            tile.lineTo(x + 0.5, y + height)

            tile.fillPath()
            tile.strokePath()
        }
    }
}

// placeHoverTile(tile) {
//   var hoverTile = this.tiles.create(
// 	  tile.x,
// 	  tile.y,
// 	  'hover_tile'
//   ).setOrigin(0).setDepth(5)
//
//   tile.on('pointerout', () => {
// 	  hoverTile.destroy()
//   })
// }
