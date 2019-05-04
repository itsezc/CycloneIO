export default class Room {
    constructor(scene, id) {
        this.scene = scene
        this.id = id
    }

    create() {
        this.tiles = this.scene.add.group()
        this.stairs = this.scene.add.group()
        this.walls = this.scene.add.group()

        this.scene.game.socket.emit('newRoom', this.id)

        this.registerEvents()
    }

    registerEvents() {
        this.scene.game.socket.on('newRoom', roomData => {
            this.addRoom(roomData)
        })
    }

    addRoom(roomData) {
        roomData.map.forEach((squares, row) => {
            squares.forEach((square, index) => {
                let x = row * 32 + index * 32
                let y = (row * 32 - index * 32) / 2
                let z = square[1] * 32 || 0
                let depth = row - index

                var tile = this.scene.add.image(x, y - z, 'tile')

                tile.setDepth(depth)
                tile.setInteractive({ pixelPerfect: true })

                var hover

                tile.on('pointerover', () => {
                    hover = this.scene.add.image(x, y - z, 'tile_hover')
                    hover.setDepth(depth + 1)
                    hover.setOrigin(0.5, 0.65)
                })

                tile.on('pointerout', () => {
                    hover.destroy()
                })

                if (!roomData.properties.wall.hidden) {
                    if (this.isLeftWall(roomData.map[row - 1], index)) {
                        this.addLeftWall(x, y, depth)
                    }

                    if (this.isRightWall(squares[index + 1])) {
                        this.addRightWall(x, y, depth)
                    }
                }
            })
        })
    }

    isLeftWall(topSquares, index) {
        if (topSquares === undefined) {
            return true
        } else {
            if (topSquares[index] === undefined) {
                return true
            }
        }

        return false
    }

    addLeftWall(x, y, depth) {
        var wallLeft

        wallLeft = this.scene.add.image(x, y, 'wall_left')
        wallLeft.setDepth(depth - 1)
        wallLeft.setOrigin(1, 0.97)

        this.walls.add(wallLeft)
    }

    isRightWall(rightSquare) {
        return rightSquare === undefined
    }

    addRightWall(x, y, depth) {
        var wallRight

        wallRight = this.scene.add.image(x, y, 'wall_right')
        wallRight.setDepth(depth - 1)
        wallRight.setOrigin(0, 0.97)

        this.walls.add(wallRight)
    }
}
